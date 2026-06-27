"use client";

import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/forms";
import { authClient } from "@/server/better-auth/client";
import { IconHammer, IconUser } from "@tabler/icons-react";
import { toast } from "sonner";
import z from "zod";

interface InviteMemberFormProps {
  onSuccess: () => void;
}

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member"]),
});

export function InviteMemberForm({ onSuccess }: InviteMemberFormProps) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      role: "member",
    },
    validators: {
      onSubmit: inviteMemberSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.organization.inviteMember({
        email: value.email,
        role: value.role as "owner" | "admin" | "member",
      });

      if (error) {
        toast.error("Failed to invite member!", {
          description: error.message,
        });
        return;
      }

      toast.success("Member invited successfully!", {
        description: `Invited ${value.email} as ${value.role}.`,
      });
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              placeholder="m@example.com"
            />
          )}
        </form.AppField>
        <form.AppField name="role">
          {(field) => (
            <field.SelectField
              label="Role"
              options={[
                {
                  label: "Admin",
                  value: "admin",
                  icon: IconHammer,
                },
                {
                  label: "Member",
                  value: "member",
                  icon: IconUser,
                },
              ]}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton label="Invite Member" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

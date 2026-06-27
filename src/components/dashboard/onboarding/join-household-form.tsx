"use client";

import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/lib/forms";
import { authClient } from "@/server/better-auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function JoinHouseholdForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      inviteCode: "",
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.organization.acceptInvitation({
        invitationId: value.inviteCode,
      });

      if (error) {
        toast.error("Failed to join household!", {
          description: error.message,
        });
        return;
      }

      await authClient.organization.setActive({
        organizationId: data.invitation.organizationId,
      });

      toast.success("Joined household successfully!", {
        description: "Redirecting to dashboard...",
      });

      router.push("/dashboard");
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
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Join a &quot;Household&quot;</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Join a household using the invitation code provided by your
            household leader.
          </p>
        </div>
        <form.AppField name="inviteCode">
          {(field) => (
            <field.TextField label="Invitation Code" placeholder="xxxxxx" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton label="Join Household" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

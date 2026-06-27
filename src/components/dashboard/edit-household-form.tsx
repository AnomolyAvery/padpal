"use client";

import { useAppForm } from "@/lib/forms";
import { FieldGroup } from "../ui/field";
import { authClient } from "@/server/better-auth/client";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import z from "zod";

const editHouseholdSchema = z.object({
  name: z.string().min(3),
});

export function EditHouseholdForm() {
  const { data, isPending, refetch } = authClient.useActiveOrganization();

  const form = useAppForm({
    defaultValues: {
      name: data?.name ?? "",
    },
    validators: {
      onSubmit: editHouseholdSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!formApi.state.isTouched) {
        return;
      }

      const { error } = await authClient.organization.update({
        data: {
          name: value.name,
        },
        organizationId: data?.id,
      });

      if (error) {
        toast.error("Failed to update household!", {
          description: error.message,
        });
        return;
      }

      toast.success("Household updated successfully!", {
        description: "Your household has been updated successfully.",
      });
      await refetch();
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner />
        <p className="text-muted-foreground font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => <field.TextField label="Name" placeholder="My Home" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton label="Save Changes" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

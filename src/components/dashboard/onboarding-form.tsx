"use client";

import { useAppForm } from "@/lib/forms";
import { FieldGroup } from "../ui/field";
import { authClient } from "@/server/better-auth/client";
import { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.organization.create({
        name: value.name,
        slug: value.name.toLowerCase().replace(/\s+/g, "-"),
        metadata: {},
        keepCurrentActiveOrganization: false,
      });

      if (error) {
        setError(
          error.message ?? "An unknown error occurred. Please try again",
        );
        return;
      }

      toast.success("Household created!", {
        description: `Successfully created '${data.name}'. Redirecting to dashboard...`,
      });
      router.push("/dashboard");
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setError(null);
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create a &quot;Household&quot;</h1>
          <p className="text-muted-foreground text-sm text-balance">
            A household is a way to organize and share expenses with your
            family.
          </p>
        </div>

        {error && (
          <Alert variant={"destructive"}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form.AppField name="name">
          {(field) => (
            <field.TextField label="Name" placeholder="My Household" />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="Create Household" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

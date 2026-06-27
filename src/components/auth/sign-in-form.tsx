"use client";

import { FieldDescription, FieldGroup } from "../ui/field";
import { IconAlertTriangle, IconHomeDollar } from "@tabler/icons-react";
import Link from "next/link";
import { useAppForm } from "@/lib/forms";
import z from "zod";
import { authClient } from "@/server/better-auth/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export function SignInForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
          formApi.resetField("password");
        }

        setError(
          error.message ?? "An unknown error occurred. Please try again",
        );
        return;
      }

      router.push("/dashboard");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setError(null);
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <IconHomeDollar className="size-6" />
              </div>
              <span className="sr-only">PadPal.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to PadPal.</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </FieldDescription>
          </div>

          {error && (
            <Alert variant={"destructive"}>
              <IconAlertTriangle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form.AppField name="email">
            {(field) => (
              <field.TextField label="Email" placeholder="m@example.com" />
            )}
          </form.AppField>

          <form.AppField name="password">
            {(field) => (
              <field.TextField
                type="password"
                label="Password"
                placeholder="Password"
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton label="Sign In" />
          </form.AppForm>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

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

const signUpSchema = z
  .object({
    firstName: z.string().min(3, "Must be at least 3 characters"),
    lastName: z.string().min(3, "Must be at least 3 characters"),
    email: z.string().email(),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        name: `${value.firstName} ${value.lastName}`,
        email: value.email,
        password: value.password,
      });

      if (error) {
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
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <IconHomeDollar className="size-6" />
              </div>
              <span className="sr-only">PadPal.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to PadPal.</h1>
            <FieldDescription>
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </FieldDescription>
          </div>

          {error && (
            <Alert variant={"destructive"}>
              <IconAlertTriangle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <form.AppField name="firstName">
              {(field) => (
                <field.TextField label="First Name" placeholder="John" />
              )}
            </form.AppField>
            <form.AppField name="lastName">
              {(field) => (
                <field.TextField label="Last Name" placeholder="Doe" />
              )}
            </form.AppField>
          </div>

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

          <form.AppField name="confirmPassword">
            {(field) => (
              <field.TextField
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
              />
            )}
          </form.AppField>

          <form.AppForm>
            <form.SubmitButton label="Sign Up" />
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

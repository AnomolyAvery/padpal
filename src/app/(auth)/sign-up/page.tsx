import { SignUpForm } from "@/components/auth/sign-up-form";
import { signUpMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = signUpMetadata;

export default function Page() {
  return (
    <main>
      <SignUpForm />
    </main>
  );
}

import { SignInForm } from "@/components/auth/sign-in-form";
import { signInMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = signInMetadata;

export default function Page() {
  return (
    <main>
      <SignInForm />
    </main>
  );
}

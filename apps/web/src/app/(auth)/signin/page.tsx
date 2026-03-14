import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@web/components/auth/auth-card";

import SignInForm from "../../../components/auth/signin-form";
import { ROUTES } from "@web/lib/routes";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Nudge account to manage your projects.",
};

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign In"
      footer={
        <span>
          Don't have an account? <Link href={ROUTES.signup}>Sign Up</Link>{" "}
          instead!
        </span>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}

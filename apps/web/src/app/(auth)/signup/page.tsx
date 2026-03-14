import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@web/components/auth/auth-card";

import SignUpForm from "../../../components/auth/signup-form";
import { ROUTES } from "@web/lib/routes";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a Nudge account to start tracking and managing your projects.",
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Sign Up"
      footer={
        <span>
          Already have an account? <Link href={ROUTES.signin}>Sign In</Link>{" "}
          instead!
        </span>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}

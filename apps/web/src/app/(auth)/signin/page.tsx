import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@web/components/auth/auth-card";

import SignInForm from "@web/components/auth/signin-form";
import { ROUTES } from "@web/lib/routes";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Nudge account to manage your projects.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }> | { callbackUrl?: string };
}) {
  const resolvedParams = await searchParams; // or use React.use() if you have it
  const signupHref = resolvedParams?.callbackUrl
    ? `${ROUTES.signup}?callbackUrl=${encodeURIComponent(resolvedParams.callbackUrl)}`
    : ROUTES.signup;

  return (
    <AuthCard
      title="Sign In"
      footer={
        <span>
          Don't have an account? <Link href={signupHref}>Sign Up</Link> instead!
        </span>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}

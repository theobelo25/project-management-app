import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '@web/components/auth/auth-card';

import SignInForm from '@web/components/auth/signin-form';
import { ROUTES } from '@web/lib/routes';
import { sanitizeCallbackUrl } from '@web/lib/safe-callback-url';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Nudge account to manage your projects.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }> | { callbackUrl?: string };
}) {
  const resolvedParams = await searchParams; // or use React.use() if you have it
  const hasCallbackUrl = Boolean(resolvedParams?.callbackUrl);
  const callbackUrl = sanitizeCallbackUrl(resolvedParams?.callbackUrl);
  const signupHref = hasCallbackUrl
    ? `${ROUTES.signup}?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : ROUTES.signup;

  return (
    <AuthCard
      title="Sign In"
      footer={
        <span>
          Don&apos;t have an account? <Link href={signupHref}>Sign Up</Link>{' '}
          instead!
        </span>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}

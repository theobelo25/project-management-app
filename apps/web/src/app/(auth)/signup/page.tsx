import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '@web/components/auth/auth-card';

import SignUpForm from '@web/components/auth/signup-form';
import { ROUTES } from '@web/lib/routes';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create a Nudge account to start tracking and managing your projects.',
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const resolvedParams = await searchParams; // or use React.use() if you have it
  const signinHref = resolvedParams?.callbackUrl
    ? `${ROUTES.signin}?callbackUrl=${encodeURIComponent(resolvedParams.callbackUrl)}`
    : ROUTES.signin;

  return (
    <AuthCard
      title="Sign Up"
      footer={
        <span>
          Already have an account? <Link href={signinHref}>Sign In</Link>{' '}
          instead!
        </span>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}

'use client';

import Link from 'next/link';

import { Button } from '@web/components/ui/button';
import { PageLayout } from '@web/components/layout/page-layout';
import ProfileForm from '@web/components/auth/profile-form';

import { ROUTES } from '@web/lib/routes';
import { useMeQuery } from '@web/lib/api/queries';

export default function ProfilePage() {
  const { data: me, isPending: isMePending } = useMeQuery();

  if (isMePending) {
    return (
      <PageLayout className="py-6">
        <div className="max-w-lg">
          <div className="h-12 w-40 animate-pulse rounded bg-muted" />
        </div>
      </PageLayout>
    );
  }

  if (!me) {
    return (
      <PageLayout className="py-6">
        <div className="max-w-lg">
          <p className="text-sm text-muted-foreground">
            Please sign in to view and update your profile.
          </p>
          <Button asChild className="mt-4">
            <Link href={ROUTES.signin}>Sign in</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="py-6">
      <div className="mx-auto max-w-lg space-y-6">
        <ProfileForm user={me} />
      </div>
    </PageLayout>
  );
}

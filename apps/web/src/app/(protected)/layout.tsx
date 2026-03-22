import type { Metadata } from 'next';
import { AppFooter, AppHeader } from '@web/components/layout';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your projects and tasks in Nudge.',
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader />
      <main className="flex min-h-0 flex-1 flex-col min-w-0">{children}</main>
      <AppFooter />
    </div>
  );
}

import type { ReactNode } from 'react';

import { AppHeader } from '@web/components/layout';

export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <AppHeader />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}

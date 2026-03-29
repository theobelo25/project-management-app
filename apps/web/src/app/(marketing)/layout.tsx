import type { ReactNode } from 'react';

import { AppHeader } from '@web/components/layout';

export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <AppHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-0 min-w-0 flex-1 flex-col outline-none"
      >
        {children}
      </main>
    </div>
  );
}

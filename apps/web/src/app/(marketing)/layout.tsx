import type { ReactNode } from 'react';

export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="flex min-h-0 flex-1 flex-col min-w-0">{children}</main>
  );
}

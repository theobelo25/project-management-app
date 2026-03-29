import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SkipLink } from '@web/components/layout/skip-link';
import { AppProvider } from '@web/components/providers/app-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Nudge – Project management made simple',
    template: '%s | Nudge',
  },
  description:
    'Track your next project with ease. Plan, collaborate, and ship with Nudge.',
  openGraph: {
    title: 'Nudge – Project management made simple',
    description:
      'Track your next project with ease. Plan, collaborate, and ship with Nudge.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="[scrollbar-gutter:stable]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AppProvider>
          <SkipLink />
          <div className="flex min-h-0 min-h-screen flex-1 flex-col">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

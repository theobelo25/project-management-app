import Link from 'next/link';
import { MainNav } from './main-nav';
import { PageLayout } from './page-layout';
import { SecondaryNav } from './secondary-nav';

export function AppHeader() {
  return (
    <PageLayout>
      <header className="flex justify-between py-4">
        <div className="flex gap-16 items-center">
          <Link href={'/'}>
            <span className="text-2xl font-bold">Nudge</span>
          </Link>
          <MainNav />
        </div>
        <SecondaryNav />
      </header>
    </PageLayout>
  );
}

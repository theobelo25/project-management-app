import { MainNav } from "./main-nav";
import { PageLayout } from "./page-layout";
import { SecondaryNav } from "./secondary-nav";

export function AppHeader() {
  return (
    <PageLayout>
      <header className="flex justify-between py-4">
        <div className="flex gap-16">
          <h1>Nudge</h1>
          <MainNav />
        </div>
        <SecondaryNav />
      </header>
    </PageLayout>
  );
}

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { SecondaryNav } from './secondary-nav';
import { ROUTES } from '@web/lib/routes';

const navItems = [
  { href: ROUTES.dashboard, label: 'Dashboard' },
  { href: ROUTES.projects, label: 'Projects' },
  { href: ROUTES.organizations, label: 'Organizations' },
] as const;

function NavLinks() {
  return (
    <nav className="flex gap-8">
      {navItems.map(({ href, label }) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function MainNav() {
  return (
    <>
      <div className="hidden md:block">
        <NavLinks />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-70">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 pt-4">
            {navItems.map(({ href, label }) => (
              <SheetTrigger asChild key={href}>
                <Link
                  href={href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {label}
                </Link>
              </SheetTrigger>
            ))}
          </div>
          <SecondaryNav />
        </SheetContent>
      </Sheet>
    </>
  );
}

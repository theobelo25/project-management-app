'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@web/lib/utils';
import { ROUTES } from '@web/lib/routes';

type ProjectSubnavItem = {
  label: string;
  href: string;
  exact?: boolean;
};

export function ProjectSubnav() {
  const params = useParams();
  const pathname = usePathname();

  const projectId = params.id as string;
  const items: ProjectSubnavItem[] = [
    {
      label: 'Overview',
      href: `${ROUTES.projects}/${projectId}`,
      exact: true,
    },
    {
      label: 'Board',
      href: `${ROUTES.projects}/${projectId}/board`,
    },
    {
      label: 'Calendar',
      href: `${ROUTES.projects}/${projectId}/calendar`,
    },
    {
      label: 'Tasks',
      href: `${ROUTES.projects}/${projectId}/tasks`,
    },
    {
      label: 'Members',
      href: `${ROUTES.projects}/${projectId}/members`,
    },
    {
      label: 'Settings',
      href: `${ROUTES.projects}/${projectId}/settings`,
    },
  ];

  return (
    <nav aria-label="Project navigation" className="bg-background mb-6">
      <div className="flex items-center gap-2 overflow-x-auto border-b">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex h-11 items-center border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

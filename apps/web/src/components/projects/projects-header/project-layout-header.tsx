'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';

import { PageHeader } from '@web/components/projects';
import { CreateTaskDialog } from '@web/components/projects/tasks';
import { formatProjectRole } from '@web/components/projects/utils';
import { Badge } from '@web/components/ui/badge';
import { Button } from '@web/components/ui/button';
import { ROUTES } from '@web/lib/routes';
import type { ProjectRole } from '@repo/types';

type ProjectForHeader = {
  id: string;
  name: string;
  description?: string | null;
  currentUserRole?: ProjectRole;
};

type ProjectLayoutHeaderProps = {
  project: ProjectForHeader | null;
};

type RouteConfig = {
  path: string; // pathname suffix, e.g. "" for overview, "/board", "/tasks"
  backLabel: string;
  backHref: (project: ProjectForHeader) => string;
  title: string | ((project: ProjectForHeader) => React.ReactNode);
  description:
    | React.ReactNode
    | ((project: ProjectForHeader) => React.ReactNode);
  badge?: (project: ProjectForHeader) => React.ReactNode;
  actions?: (project: ProjectForHeader) => React.ReactNode;
};

function createRouteConfig(projectHref: string): RouteConfig[] {
  return [
    {
      path: '',
      backLabel: 'Back to Projects',
      backHref: () => ROUTES.projects,
      title: (p) => p.name,
      description: (p) => p.description || 'No description provided.',
      badge: (p) =>
        p.currentUserRole ? (
          <Badge variant="secondary">
            {formatProjectRole(p.currentUserRole)}
          </Badge>
        ) : (
          <Badge variant="outline">Read-only</Badge>
        ),
      actions: (p) => (
        <>
          {p.currentUserRole ? (
            <>
              <Button asChild variant="outline">
                <Link href={`${projectHref}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <CreateTaskDialog projectId={p.id} />
            </>
          ) : (
            <>
              <Button variant="outline" disabled>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button disabled>New Task</Button>
            </>
          )}
        </>
      ),
    },
    {
      path: '/board',
      backLabel: 'Back to Project',
      backHref: () => projectHref,
      title: 'Board',
      description: 'Kanban view of tasks by status.',
      actions: (p) =>
        p.currentUserRole ? (
          <CreateTaskDialog projectId={p.id} />
        ) : (
          <Button disabled>New Task</Button>
        ),
    },
    {
      path: '/calendar',
      backLabel: 'Back to Project',
      backHref: () => projectHref,
      title: 'Calendar',
      description: 'View task deadlines by date.',
      actions: (p) =>
        p.currentUserRole ? (
          <CreateTaskDialog projectId={p.id} />
        ) : (
          <Button disabled>New Task</Button>
        ),
    },
    {
      path: '/tasks',
      backLabel: 'Back to Project',
      backHref: () => projectHref,
      title: 'Tasks',
      description: (p) => (
        <>
          Manage all tasks in <span className="font-medium">{p.name}</span>.
        </>
      ),
      actions: (p) =>
        p.currentUserRole ? (
          <CreateTaskDialog projectId={p.id} />
        ) : (
          <Button disabled>New Task</Button>
        ),
    },
    {
      path: '/members',
      backLabel: 'Back to Project',
      backHref: () => projectHref,
      title: 'Members',
      description: (p) => (
        <>
          Manage access for <span className="font-medium">{p.name}</span>.
        </>
      ),
    },
    {
      path: '/settings',
      backLabel: 'Back to Project',
      backHref: () => projectHref,
      title: 'Project Settings',
      description: (p) => (
        <>
          Manage project details, members, and administrative actions for{' '}
          <span className="font-medium">{p.name}</span>.
        </>
      ),
    },
  ];
}

export function ProjectLayoutHeader({ project }: ProjectLayoutHeaderProps) {
  const pathname = usePathname();

  if (!project) return null;

  const projectHref = `${ROUTES.projects}/${project.id}`;
  const tasksHref = `${projectHref}/tasks`;

  const isTaskDetail = pathname?.startsWith(tasksHref + '/') ?? false;
  if (isTaskDetail) return null;

  const configs = createRouteConfig(projectHref);
  const config = configs.find((c) => {
    const fullPath = projectHref + c.path;
    return pathname === fullPath;
  });

  if (!config) return null;

  const title =
    typeof config.title === 'function' ? config.title(project) : config.title;
  const description =
    typeof config.description === 'function'
      ? config.description(project)
      : config.description;
  const backHref = config.backHref(project);

  return (
    <PageHeader
      backHref={backHref}
      backLabel={config.backLabel}
      title={title}
      badge={config.badge?.(project)}
      description={description}
      actions={config.actions?.(project)}
    />
  );
}

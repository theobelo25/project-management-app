"use client";

import { PageLayout } from "@web/components/layout/page-layout";
import {
  DashboardProjectsCard,
  DashboardStats,
  DashboardTasksCard,
  DashboardWelcome,
} from "@web/components/dashboard";
import { useProjectsQuery, useProjectTasksQuery } from "@web/lib/api/queries";
import type {
  PaginatedProjectsListView,
  PaginationResult,
  TaskView,
} from "@repo/types";
import {
  DASHBOARD_PROJECTS_QUERY,
  DASHBOARD_TASKS_LIMIT,
} from "@web/lib/api/queries";

type DashboardContentProps = {
  initialProjects: PaginatedProjectsListView | null;
  initialTasks: PaginationResult<TaskView> | null;
  firstProjectId: string | null;
};

export function DashboardContent({
  initialProjects,
  initialTasks,
  firstProjectId,
}: DashboardContentProps) {
  const projectsQuery = useProjectsQuery(DASHBOARD_PROJECTS_QUERY, {
    initialData: initialProjects ?? undefined,
    initialDataUpdatedAt: initialProjects ? Date.now() : 0,
  });

  const tasksQueryParams = {
    page: 1,
    limit: DASHBOARD_TASKS_LIMIT,
  };

  const tasksQuery = useProjectTasksQuery(firstProjectId, tasksQueryParams, {
    initialData: initialTasks ?? undefined,
    initialDataUpdatedAt: initialTasks ? Date.now() : 0,
  });

  const projectsData = projectsQuery.data;
  const tasksData = tasksQuery.data;

  const totalProjects = projectsData?.total ?? 0;
  const openTasksCount =
    projectsData?.items.reduce((sum, p) => sum + p.openTasks, 0) ?? 0;
  const completedCount =
    projectsData?.items.reduce((sum, p) => sum + p.completedTasks, 0) ?? 0;

  const stats = [
    {
      title: "Projects",
      value: String(totalProjects),
      description: "Active workspaces",
      iconKey: "projects" as const,
    },
    {
      title: "Open Tasks",
      value: String(openTasksCount),
      description: "Still in progress",
      iconKey: "open" as const,
    },
    {
      title: "Completed",
      value: String(completedCount),
      description: "Finished this month",
      iconKey: "completed" as const,
    },
  ];

  const recentProjects = projectsData?.items.slice(0, 3) ?? [];
  const myTasks = tasksData?.data ?? [];

  const isPending = projectsQuery.isPending;
  const isError = projectsQuery.isError;
  const error = projectsQuery.error;

  if (isError) {
    return (
      <PageLayout className="space-y-6 pb-6">
        <div className="p-6 text-destructive">
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </div>
      </PageLayout>
    );
  }
  if (isPending && !projectsQuery.data) {
    return (
      <PageLayout className="space-y-6 pb-6">
        <div className="p-6 text-muted-foreground">Loading dashboard…</div>
      </PageLayout>
    );
  }
  return (
    <PageLayout className="space-y-6 pb-6">
      <DashboardWelcome />
      <DashboardStats stats={stats} />
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div className="sm:col-span-2 xl:col-span-2 h-full">
          <DashboardProjectsCard projects={recentProjects} />
        </div>
        <DashboardTasksCard tasks={myTasks} />
      </section>
    </PageLayout>
  );
}

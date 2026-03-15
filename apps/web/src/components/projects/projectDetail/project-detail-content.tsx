"use client";

import {
  ProjectDetailWelcome,
  ProjectMembersCard,
  ProjectOverviewCard,
  ProjectStats,
  RecentTasksCard,
} from "@web/components/projects/projectDetail";
import { useProjectQuery } from "@web/lib/api/queries";
import type { ProjectDetailView } from "@repo/types";

type ProjectMember = {
  id: string;
  name: string;
  email?: string;
};

type ProjectTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

type ProjectDetailContentProps = {
  projectId: string;
  initialProject: ProjectDetailView | null;
};

export function ProjectDetailContent({
  projectId,
  initialProject,
}: ProjectDetailContentProps) {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectQuery(projectId, {
    initialData: initialProject ?? undefined,
    initialDataUpdatedAt: initialProject ? Date.now() : undefined,
  });

  if (isLoading && !project) {
    return null; // Route-level loading.tsx handles the shell
  }

  if (isError || !project) {
    return (
      <>
        <div className="flex items-center justify-center py-12 text-destructive">
          {error?.message ?? "Project not found"}
        </div>
      </>
    );
  }

  const totalTasks =
    "totalTasks" in project && typeof project.totalTasks === "number"
      ? project.totalTasks
      : 0;
  const completedTasks =
    "completedTasks" in project && typeof project.completedTasks === "number"
      ? project.completedTasks
      : 0;
  const openTasks =
    "openTasks" in project && typeof project.openTasks === "number"
      ? project.openTasks
      : 0;
  const members: ProjectMember[] =
    "members" in project && Array.isArray(project.members)
      ? (project.members as ProjectMember[])
      : [];
  const recentTasks: ProjectTask[] =
    "recentTasks" in project && Array.isArray(project.recentTasks)
      ? (project.recentTasks as ProjectTask[])
      : [];

  return (
    <>
      <ProjectDetailWelcome project={project} />
      <ProjectStats
        totalTasks={totalTasks}
        openTasks={openTasks}
        completedTasks={completedTasks}
        members={members}
      />
      <section className="grid gap-4 mb-4 lg:grid-cols-2">
        <RecentTasksCard project={project} recentTasks={recentTasks} />
        <ProjectMembersCard project={project} members={members} />
        <div className="lg:col-span-2">
          <ProjectOverviewCard project={project} openTasks={openTasks} />
        </div>
      </section>
    </>
  );
}

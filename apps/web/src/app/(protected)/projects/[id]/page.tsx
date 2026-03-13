"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FolderKanban,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import React from "react";
import { useProjectQuery } from "@web/lib/api/queries";
import type { ProjectRole } from "@repo/types";

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

function formatRole(role: ProjectRole | undefined): string {
  if (!role) return "Member";
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

function formatTaskStatus(status: ProjectTask["status"]) {
  switch (status) {
    case "TODO":
      return "Todo";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = React.useState<{
    id: string;
  } | null>(null);
  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const projectId = resolvedParams?.id ?? null;
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProjectQuery(projectId);

  if (!resolvedParams) return null;
  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12">
          Loading project…
        </div>
      </div>
    );
  }
  if (isError || !project) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12 text-destructive">
          {error?.message ?? "Project not found"}
        </div>
      </div>
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {project.name}
              </h1>
              <Badge variant="secondary">
                {formatRole(project.currentUserRole)}
              </Badge>
            </div>

            <p className="max-w-3xl text-sm text-muted-foreground">
              {project.description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={`/projects/${project.id}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>

            <Button asChild>
              <Link href={`/projects/${project.id}/tasks/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CardDescription>All tasks in this project</CardDescription>
            </div>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {totalTasks}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <CardDescription>Tasks still in progress</CardDescription>
            </div>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">{openTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CardDescription>Finished tasks</CardDescription>
            </div>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {completedTasks}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <CardDescription>People in this project</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {members.length}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                A quick view of work happening inside this project.
              </CardDescription>
            </div>

            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${project.id}/tasks`}>View all tasks</Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTaskStatus(task.status)}
                    </p>
                  </div>

                  <Badge variant="outline">
                    {formatTaskStatus(task.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No tasks yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  People collaborating on this project.
                </CardDescription>
              </div>

              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${project.id}/members`}>Manage</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {member.email ?? ""}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Basic project information and quick actions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">
                  {formatRole(project.currentUserRole)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Project ID</span>
                <span className="font-medium">{project.id}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Open tasks</span>
                <span className="font-medium">{openTasks}</span>
              </div>

              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href={`/projects/${project.id}/tasks/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

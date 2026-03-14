"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Pencil,
  User,
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
import { useParams } from "next/navigation";
import { useTaskQuery } from "@web/lib/api/queries";
import { useState } from "react";
import { EditTaskDialog } from "@web/components/tasks/edit-task-dialog";

function formatTaskStatus(status: string) {
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

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "DONE":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    default:
      return "outline";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TaskDetailPage() {
  const params = useParams();

  const projectId = params?.id as string | undefined;
  const taskId = params?.taskId as string | undefined;

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useTaskQuery(taskId ?? null);
  const [editOpen, setEditOpen] = useState(false);

  if (!taskId || !projectId) return null;

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12">
          Loading task…
        </div>
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12 text-destructive">
          {error?.message ?? "Task not found"}
        </div>
      </div>
    );
  }

  const assignee = task.assignees?.[0]?.user;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href={`/projects/${projectId}/tasks`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {task.title}
              </h1>
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {formatTaskStatus(task.status)}
              </Badge>
            </div>

            <p className="max-w-3xl text-sm text-muted-foreground">
              View task details, ownership, and status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Description and current work context for this task.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Description
              </h2>
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {task.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Circle className="h-4 w-4" />
                  <span className="text-sm">Status</span>
                </div>
                <p className="font-medium">{formatTaskStatus(task.status)}</p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Assignee</span>
                </div>
                <p className="font-medium">{assignee?.name || "Unassigned"}</p>
              </div>

              <div className="rounded-xl border p-4">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Task ID</span>
                </div>
                <p className="truncate font-medium">{task.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignee</CardTitle>
              <CardDescription>
                The person currently responsible for this task.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {assignee ? (
                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
                    {getInitials(assignee.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">{assignee.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {assignee.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  This task has not been assigned yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                Timing information for this task.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <span className="text-right font-medium">
                  {formatDate(task.createdAt)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated</span>
                </div>
                <span className="text-right font-medium">
                  {formatDate(task.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions for managing this task.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Task
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href={`/projects/${projectId}/tasks`}>
                  Back to all tasks
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      <EditTaskDialog
        projectId={projectId}
        task={{
          id: task.id,
          title: task.title,
          description: task.description ?? null,
        }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}

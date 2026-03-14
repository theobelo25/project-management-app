"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { CreateTaskDialog } from "@web/components/tasks/create-task-dialog";
import {
  TasksToolbar,
  type TasksFilterStatus,
  type TasksSort,
} from "@web/components/tasks/tasks-toolbar";
import { TasksTable } from "@web/components/tasks/tasks-table";
import type { TaskListItem } from "@web/components/tasks/types";
import { ProjectsPagination } from "@web/components/projects/projects-pagination";

import { Button } from "@web/components/ui/button";
import { useParams } from "next/navigation";
import {
  PROJECT_TASKS_QUERY_KEY,
  useProjectQuery,
  useProjectTasksQuery,
} from "@web/lib/api/queries";
import { taskViewToListItem } from "@web/components/tasks/task-view-to-list-item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@web/lib/api/client";

const PAGE_SIZE = 10;

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params.id as string | undefined;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TasksFilterStatus>("all");
  const [assigneeId, setAssigneeId] = useState("all");
  const [sort, setSort] = useState<TasksSort>("updated-desc");
  const [page, setPage] = useState(1);

  const { data: project, isLoading: projectLoading } = useProjectQuery(
    projectId ?? null,
  );
  const { data: tasksResult, isLoading: tasksLoading } = useProjectTasksQuery(
    projectId ?? "",
    {
      projectId: projectId ?? "",
      page,
      limit: PAGE_SIZE,
      status: status === "all" ? undefined : status,
      assigneeId: assigneeId === "all" ? undefined : assigneeId,
      search: search.trim() || undefined,
    },
  );

  const queryClient = useQueryClient();
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async () => {
      if (projectId)
        await queryClient.refetchQueries({
          queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
        });
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  function handleDeleteTask(taskId: string) {
    deleteTaskMutation.mutate(taskId);
  }

  function handleClear() {
    setSearch("");
    setStatus("all");
    setAssigneeId("all");
    setSort("updated-desc");
    setPage(1);
  }

  const taskListItems = useMemo(
    () => (tasksResult?.data ?? []).map(taskViewToListItem),
    [tasksResult?.data],
  );
  const meta = tasksResult?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.pageCount ?? 1;

  const members = useMemo(() => {
    if (!project || !("members" in project) || !Array.isArray(project.members))
      return [];
    return (project.members as { id: string; name: string }[]).map((m) => ({
      id: m.id,
      name: m.name,
    }));
  }, [project]);

  if (!projectId) return null;
  if (projectLoading || (project && !project.id)) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12">Loading…</div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
        <div className="flex items-center justify-center py-12 text-destructive">
          Project not found
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href={`/projects/${project.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage all tasks in{" "}
              <span className="font-medium">{project.name}</span>.
            </p>
          </div>

          <CreateTaskDialog projectId={project.id} />
        </div>
      </div>

      <TasksToolbar
        search={search}
        status={status}
        assigneeId={assigneeId}
        sort={sort}
        assignees={members}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onAssigneeChange={(value) => {
          setAssigneeId(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onClear={handleClear}
      />

      <TasksTable
        projectId={project.id}
        tasks={taskListItems}
        onDelete={handleDeleteTask}
        emptyTitle={
          totalCount === 0 && (tasksResult?.data?.length ?? 0) > 0
            ? "No tasks match your filters"
            : "No tasks yet"
        }
        emptyDescription={
          totalCount === 0 && (tasksResult?.data?.length ?? 0) > 0
            ? "Try adjusting your search or filters to find what you're looking for."
            : "Create your first task to start tracking work in this project."
        }
      />

      {totalCount > 0 ? (
        <ProjectsPagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

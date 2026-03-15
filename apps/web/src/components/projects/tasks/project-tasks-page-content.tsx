"use client";

import { useMemo, useState } from "react";
import {
  TasksToolbar,
  TasksTable,
  taskViewToListItem,
  TasksWelcome,
  type TasksFilterStatus,
  type TasksSort,
} from "@web/components/projects/tasks";
import {
  ProjectsPagination,
  PageLoadingMessage,
  PageErrorMessage,
} from "@web/components/projects";
import {
  PROJECT_TASKS_QUERY_KEY,
  useProjectQuery,
  useProjectTasksQuery,
} from "@web/lib/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@web/lib/api/client";
import { toast } from "sonner";
import type {
  PaginationResult,
  TaskView,
  ProjectDetailView,
} from "@repo/types";

type ProjectTasksPageContentProps = {
  projectId: string;
  initialProject: ProjectDetailView | null;
  initialTasks: PaginationResult<TaskView> | null;
  pageSize: number;
};

export function ProjectTasksPageContent({
  projectId,
  initialProject,
  initialTasks,
  pageSize: PAGE_SIZE,
}: ProjectTasksPageContentProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TasksFilterStatus>("all");
  const [assigneeId, setAssigneeId] = useState("all");
  const [sort, setSort] = useState<TasksSort>("updated-desc");
  const [page, setPage] = useState(1);

  const isInitialTasksQuery =
    page === 1 && status === "all" && assigneeId === "all" && !search.trim();

  const { data: project, isLoading: projectLoading } = useProjectQuery(
    projectId,
    {
      initialData: initialProject ?? undefined,
      initialDataUpdatedAt: initialProject ? Date.now() : undefined,
    },
  );

  const { data: tasksResult, isLoading: tasksLoading } = useProjectTasksQuery(
    projectId,
    {
      projectId,
      page,
      limit: PAGE_SIZE,
      status: status === "all" ? undefined : status,
      assigneeId: assigneeId === "all" ? undefined : assigneeId,
      search: search.trim() || undefined,
    },
    {
      initialData: isInitialTasksQuery
        ? (initialTasks ?? undefined)
        : undefined,
      initialDataUpdatedAt:
        isInitialTasksQuery && initialTasks ? Date.now() : undefined,
    },
  );

  const queryClient = useQueryClient();
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      toast.success("Task deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
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

  if (projectLoading && !project) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
        <PageLoadingMessage />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
        <PageErrorMessage message="Project not found" />
      </div>
    );
  }

  return (
    <>
      <TasksWelcome project={project} />

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
    </>
  );
}

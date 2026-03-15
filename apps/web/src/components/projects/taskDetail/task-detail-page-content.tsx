"use client";

import { useTaskQuery } from "@web/lib/api/queries";
import { useState } from "react";
import { EditTaskDialog } from "@web/components/projects/tasks";
import {
  TaskDetailWelcome,
  TaskDetailsCard,
  TaskAssigneeCard,
  TaskActivityCard,
  TaskQuickActionsCard,
} from "@web/components/projects/taskDetail";
import type { TaskView } from "@repo/types";

type TaskDetailPageContentProps = {
  projectId: string;
  taskId: string;
  initialTask: TaskView | null;
};

export function TaskDetailPageContent({
  projectId,
  taskId,
  initialTask,
}: TaskDetailPageContentProps) {
  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useTaskQuery(taskId, {
    initialData: initialTask ?? undefined,
    initialDataUpdatedAt: initialTask ? Date.now() : undefined,
  });

  const [editOpen, setEditOpen] = useState(false);

  if (!taskId || !projectId) return null;

  if (isLoading && !task) {
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
    <>
      <TaskDetailWelcome
        projectId={projectId}
        setEditOpen={setEditOpen}
        task={task}
      />

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <TaskDetailsCard task={task} assignee={assignee} />
          <TaskAssigneeCard assignee={assignee} />
          <TaskActivityCard task={task} />
          <TaskQuickActionsCard
            projectId={projectId}
            setEditOpen={setEditOpen}
          />
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
    </>
  );
}

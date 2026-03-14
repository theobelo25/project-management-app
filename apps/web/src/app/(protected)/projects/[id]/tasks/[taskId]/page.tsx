"use client";

import { useParams } from "next/navigation";
import { useTaskQuery } from "@web/lib/api/queries";
import { useState } from "react";
import { EditTaskDialog } from "@web/components/projects/tasks/edit-task-dialog";
import { PageLayout } from "@web/components/layout/page-layout";
import {
  TaskDetailWelcome,
  TaskDetailsCard,
  TaskAssigneeCard,
  TaskActivityCard,
  TaskQuickActionsCard,
} from "@web/components/projects/taskDetail";

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
    <PageLayout>
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
    </PageLayout>
  );
}

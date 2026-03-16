"use client";

import {
  TaskAssigneeCard,
  TaskActivityCard,
  TaskDetailsCard,
  TaskQuickActionsCard,
  useTaskDetail,
} from "@web/components/projects/task-detail";
import { EditTaskDialog } from "@web/components/projects/tasks";
import { useTaskQuery } from "@web/lib/api/queries";
import { useLayoutEffect } from "react";

type TaskDetailPageContentProps = {
  projectId: string;
  taskId: string;
};

export function TaskDetailPageContent({
  projectId,
  taskId,
}: TaskDetailPageContentProps) {
  const { data: task, isLoading, isError, error } = useTaskQuery(taskId);
  const { setTaskForHeader, setEditOpen, editOpen } = useTaskDetail();

  useLayoutEffect(() => {
    if (task) {
      setTaskForHeader(projectId, task);
    }
    return () => setTaskForHeader(null, null);
  }, [projectId, task, setTaskForHeader]);

  if (!taskId || !projectId) return null;

  if (isLoading && !task) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center py-12">
          Loading task…
        </div>
      </div>
    );
  }
  if (isError || !task) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center py-12 text-destructive">
          {error?.message ?? "Task not found"}
        </div>
      </div>
    );
  }

  const assignee = task.assignees?.[0]?.user;

  return (
    <>
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

"use client";

import {
  TaskAssigneeCard,
  TaskActivityCard,
  TaskDetailsCard,
  TaskQuickActionsCard,
  useTaskDetail,
} from "@web/components/projects/task-detail";
import { EditTaskDialog } from "@web/components/projects/tasks";
import { useProjectQuery, useTaskQuery } from "@web/lib/api/queries";
import { useEffect } from "react";
import type { ProjectRole, TaskView } from "@repo/types";

type TaskDetailPageContentProps = {
  projectId: string;
  taskId: string;
};

type TaskDetailData = TaskView & {
  assignees?: { user: { id: string; name: string; email: string } }[];
};

export function TaskDetailPageContent({
  projectId,
  taskId,
}: TaskDetailPageContentProps) {
  if (!taskId || !projectId) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center py-12 text-destructive">
          Invalid task URL. Missing project or task identifier.
        </div>
      </div>
    );
  }

  const { data: task, isLoading, isError, error } = useTaskQuery(taskId);
  const { data: project } = useProjectQuery(projectId);

  const { setTaskForHeader, setEditOpen, editOpen } = useTaskDetail();

  useEffect(() => {
    if (task) {
      setTaskForHeader(projectId, task);
    }
    return () => setTaskForHeader(null, null);
  }, [projectId, task, setTaskForHeader]);

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

  const role = project?.currentUserRole as ProjectRole | undefined;
  const canEditAssignee = role === "OWNER" || role === "ADMIN";

  const taskData = task as TaskDetailData;
  const assigneeUser = taskData.assignees?.[0]?.user ?? null;
  const assigneeUserId = taskData.assignees?.[0]?.user?.id ?? null;

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <TaskDetailsCard task={task} assignee={assigneeUser} />

        <TaskAssigneeCard
          projectId={projectId}
          taskId={task.id}
          assignee={assigneeUser}
          assigneeUserId={assigneeUserId}
          canEdit={canEditAssignee}
          members={project?.members ?? []}
        />

        <TaskActivityCard task={task} />
        <TaskQuickActionsCard projectId={projectId} setEditOpen={setEditOpen} />
      </section>

      <EditTaskDialog
        projectId={projectId}
        task={{
          id: task.id,
          title: task.title,
          description: task.description ?? null,
          dueDate: task.dueDate ?? null,
        }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

'use client';

import {
  TaskAssigneeCard,
  TaskActivityCard,
  TaskDetailsCard,
  TaskQuickActionsCard,
  useTaskDetail,
} from '@web/components/projects/task-detail';
import { EditTaskDialog } from '@web/components/projects/tasks';
import { useProjectQuery, useTaskQuery } from '@web/lib/api/queries';
import { useEffect } from 'react';
type TaskDetailPageContentProps = {
  projectId: string;
  taskId: string;
};

export function TaskDetailPageContent({
  projectId,
  taskId,
}: TaskDetailPageContentProps) {
  const safeProjectId = projectId || null;
  const safeTaskId = taskId || null;

  const { data: task, isLoading, isError, error } = useTaskQuery(safeTaskId);
  const { data: project } = useProjectQuery(safeProjectId);

  const { setTaskForHeader, setEditOpen, editOpen } = useTaskDetail();

  useEffect(() => {
    if (task && safeProjectId) {
      setTaskForHeader(safeProjectId, task);
    }
    return () => setTaskForHeader(null, null);
  }, [safeProjectId, task, setTaskForHeader]);

  if (!safeTaskId || !safeProjectId) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center py-12 text-destructive">
          Invalid task URL. Missing project or task identifier.
        </div>
      </div>
    );
  }

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
          {error?.message ?? 'Task not found'}
        </div>
      </div>
    );
  }

  const role = project?.currentUserRole;
  const canEditAssignee = role === 'OWNER' || role === 'ADMIN';

  const taskData = task;
  const assigneeUser = taskData.assignees?.[0]?.user ?? null;
  const assigneeUserId = taskData.assignees?.[0]?.user?.id ?? null;

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <TaskDetailsCard task={task} assignee={assigneeUser} />

        <TaskAssigneeCard
          projectId={safeProjectId}
          taskId={task.id}
          assignee={assigneeUser}
          assigneeUserId={assigneeUserId}
          canEdit={canEditAssignee}
          members={project?.members ?? []}
        />

        <TaskActivityCard task={task} />
        <TaskQuickActionsCard
          projectId={safeProjectId}
          setEditOpen={setEditOpen}
        />
      </section>

      <EditTaskDialog
        projectId={safeProjectId}
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

'use client';

import { useDroppable } from '@dnd-kit/core';
import { Button } from '@web/components/ui/button';
import { CreateTaskDialog } from '@web/components/projects/tasks';
import { BoardCard } from './board-card';
import type { TaskStatus } from '@repo/types';

import type { BoardTask } from './types';

type BoardColumnProps = {
  projectId: string;
  status: TaskStatus;
  title: string;
  tasks: BoardTask[];
  canEditTasks?: boolean;
};

export function BoardColumn({
  projectId,
  status,
  title,
  tasks,
  canEditTasks = true,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: !canEditTasks,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-0 flex-col gap-4 rounded-lg p-3 transition-colors ${
        isOver ? 'bg-muted/70' : 'bg-muted/40'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-y-contain py-0.5 -mx-0.5 px-0.5">
        {tasks.map((task) => (
          <BoardCard key={task.id} task={task} canEdit={canEditTasks} />
        ))}
      </div>
      {canEditTasks ? (
        <div className="shrink-0">
          <CreateTaskDialog
            projectId={projectId}
            defaultStatus={status}
            trigger={
              <Button variant="ghost" size="sm" className="justify-start">
                + Add Task
              </Button>
            }
          />
        </div>
      ) : null}
    </div>
  );
}

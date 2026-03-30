'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  formatTaskPriority,
  getPriorityBadgeVariant,
} from '@web/components/projects/utils';
import { Badge } from '@web/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { cn } from '@web/lib/utils';

import { TASK_LABEL_COLOR_BORDER_CLASS } from '@web/components/projects/tasks/task-label-color-styles';
import type { BoardTask } from './types';

type BoardCardProps = {
  task: BoardTask;
  isOverlay?: boolean;
  canEdit?: boolean;
};

export function BoardCard({
  task,
  isOverlay = false,
  canEdit = true,
}: BoardCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
      disabled: isOverlay || !canEdit,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  if (isOverlay) {
    return (
      <Card
        className={cn(
          'cursor-grab opacity-95 shadow-lg ring-2 ring-primary/20',
          TASK_LABEL_COLOR_BORDER_CLASS[task.labelColor],
        )}
      >
        <CardHeader className="space-y-2 p-4 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={getPriorityBadgeVariant(task.priority)}
              className="text-[10px] font-medium"
            >
              {formatTaskPriority(task.priority)}
            </Badge>
          </div>
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
          <span>{task.description}</span>
          {task.assignee && (
            <span className="text-muted-foreground/70">{task.assignee}</span>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        canEdit
          ? 'cursor-grab active:cursor-grabbing hover:bg-muted/60'
          : 'cursor-default',
        'transition',
        isDragging ? 'opacity-50' : '',
        TASK_LABEL_COLOR_BORDER_CLASS[task.labelColor],
      )}
      {...(canEdit ? listeners : {})}
      {...(canEdit ? attributes : {})}
    >
      <CardHeader className="space-y-2 p-4 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={getPriorityBadgeVariant(task.priority)}
            className="text-[10px] font-medium"
          >
            {formatTaskPriority(task.priority)}
          </Badge>
        </div>
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
        <span>{task.description}</span>
        {task.assignee && (
          <span className="text-muted-foreground/70">{task.assignee}</span>
        )}
      </CardContent>
    </Card>
  );
}

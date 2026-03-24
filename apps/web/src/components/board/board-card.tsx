'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
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
      <Card className="cursor-grab opacity-95 shadow-lg ring-2 ring-primary/20">
        <CardHeader className="p-4 pb-2">
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
      className={`${canEdit ? 'cursor-grab active:cursor-grabbing hover:bg-muted/60' : 'cursor-default'} transition ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...(canEdit ? listeners : {})}
      {...(canEdit ? attributes : {})}
    >
      <CardHeader className="p-4 pb-2">
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

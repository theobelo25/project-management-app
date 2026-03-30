'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TASK_LABEL_COLOR_BORDER_CLASS } from '@web/components/projects/tasks/task-label-color-styles';
import { cn } from '@web/lib/utils';

import { getCalendarTaskStatusClasses } from './format';
import type { CalendarTask } from './types';

type CalendarTaskChipProps = {
  task: CalendarTask;
  onClick?: () => void;
  isOverlay?: boolean;
  canEdit?: boolean;
};

export function CalendarTaskChip({
  task,
  onClick,
  isOverlay = false,
  canEdit = true,
}: CalendarTaskChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
      disabled: isOverlay || !canEdit,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const chip = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-md border px-2 py-1 text-left text-xs transition',
        TASK_LABEL_COLOR_BORDER_CLASS[task.labelColor],
        isOverlay
          ? 'cursor-grab bg-card shadow-lg ring-2 ring-primary/20'
          : isDragging
            ? 'opacity-50'
            : canEdit
              ? 'hover:bg-muted cursor-grab active:cursor-grabbing'
              : 'cursor-default',
      )}
      {...(isOverlay || !canEdit ? {} : { ...listeners, ...attributes })}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={(e) => {
          if (!isOverlay) e.stopPropagation();
          onClick?.();
        }}
      >
        <div className="truncate font-medium">{task.title}</div>
        <div
          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getCalendarTaskStatusClasses(task.status)}`}
        >
          {task.status.replace('_', ' ')}
        </div>
      </button>
    </div>
  );

  if (isOverlay) {
    return chip;
  }

  return chip;
}

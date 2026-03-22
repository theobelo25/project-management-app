'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getCalendarTaskStatusClasses } from './format';
import type { CalendarTask } from './types';

type CalendarTaskChipProps = {
  task: CalendarTask;
  onClick?: () => void;
  isOverlay?: boolean;
};

export function CalendarTaskChip({
  task,
  onClick,
  isOverlay = false,
}: CalendarTaskChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
      disabled: isOverlay,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const chip = (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border px-2 py-1 text-left text-xs transition ${
        isOverlay
          ? 'cursor-grab bg-card shadow-lg ring-2 ring-primary/20'
          : isDragging
            ? 'opacity-50'
            : 'hover:bg-muted cursor-grab active:cursor-grabbing'
      }`}
      {...(isOverlay ? {} : { ...listeners, ...attributes })}
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

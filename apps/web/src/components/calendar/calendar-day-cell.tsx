'use client';

import { useDroppable } from '@dnd-kit/core';
import { CalendarTaskChip } from './calendar-task-chip';
import type { CalendarDay, CalendarTask } from './types';

type CalendarDayCellProps = {
  day: CalendarDay;
  tasks: CalendarTask[];
  isToday: boolean;
  canEditTasks?: boolean;
};

export function CalendarDayCell({
  day,
  tasks,
  isToday,
  canEditTasks = true,
}: CalendarDayCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.date,
    disabled: !canEditTasks,
  });

  const dayAriaLabel = [
    !day.inMonth ? 'Outside current month,' : null,
    `Day ${day.dayNumber}`,
    isToday ? 'today' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setNodeRef}
      aria-label={dayAriaLabel}
      className={[
        'min-h-36 rounded-lg border p-2 transition-colors',
        day.inMonth ? 'bg-background' : 'bg-muted/30',
        isToday ? 'ring-2 ring-primary' : '',
        isOver ? 'ring-2 ring-primary bg-primary/5' : '',
      ].join(' ')}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={[
            'text-sm font-medium',
            day.inMonth ? 'text-foreground' : 'text-muted-foreground',
          ].join(' ')}
        >
          {day.dayNumber}
        </span>

        {tasks.length > 0 ? (
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <CalendarTaskChip key={task.id} task={task} canEdit={canEditTasks} />
        ))}
      </div>
    </div>
  );
}

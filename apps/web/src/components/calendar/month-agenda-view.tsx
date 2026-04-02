'use client';

import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CalendarTaskChip } from './calendar-task-chip';
import { formatAgendaDayHeading } from './format';
import { cn } from '@web/lib/utils';

import type { CalendarDay, CalendarTask } from './types';

type AgendaDayRowProps = {
  day: CalendarDay;
  tasks: CalendarTask[];
  isToday: boolean;
  canEditTasks?: boolean;
};

function AgendaDayRow({
  day,
  tasks,
  isToday,
  canEditTasks = true,
}: AgendaDayRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.date,
    disabled: !canEditTasks,
  });

  const ariaLabel = [
    formatAgendaDayHeading(day.date),
    isToday ? 'today' : null,
    tasks.length ? `${tasks.length} tasks` : 'No tasks due',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      ref={setNodeRef}
      aria-label={ariaLabel}
      className={cn(
        'rounded-lg border p-3 transition-colors',
        isToday ? 'ring-2 ring-primary' : '',
        isOver ? 'bg-primary/5 ring-2 ring-primary' : '',
      )}
    >
      <div className="mb-2 text-sm font-medium text-foreground">
        {formatAgendaDayHeading(day.date)}
        {isToday ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            Today
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tasks due</p>
        ) : (
          tasks.map((task) => (
            <CalendarTaskChip
              key={task.id}
              task={task}
              canEdit={canEditTasks}
            />
          ))
        )}
      </div>
    </div>
  );
}

type MonthAgendaViewProps = {
  days: CalendarDay[];
  getTasksForDate: (date: string) => CalendarTask[];
  today: string;
  canEditTasks?: boolean;
};

export function MonthAgendaView({
  days,
  getTasksForDate,
  today,
  canEditTasks = true,
}: MonthAgendaViewProps) {
  const inMonthDays = useMemo(
    () =>
      days
        .filter((d) => d.inMonth)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [days],
  );

  return (
    <div className="flex flex-col gap-3" role="list">
      {inMonthDays.map((day) => (
        <div key={day.date} role="listitem">
          <AgendaDayRow
            day={day}
            tasks={getTasksForDate(day.date)}
            isToday={day.date === today}
            canEditTasks={canEditTasks}
          />
        </div>
      ))}
    </div>
  );
}

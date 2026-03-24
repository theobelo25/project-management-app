'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Card, CardContent } from '@web/components/ui/card';
import { CalendarDayCell } from './calendar-day-cell';
import { CalendarMonthHeader } from './calendar-month-header';
import { CalendarTaskChip } from './calendar-task-chip';
import { CalendarWeekdayRow } from './calendar-weekday-row';
import type { CalendarDay, CalendarTask } from './types';

type MonthCalendarProps = {
  monthLabel: string;
  days: CalendarDay[];
  getTasksForDate: (date: string) => CalendarTask[];
  today: string;
  canEditTasks?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onDueDateChange?: (taskId: string, dueDate: string) => void;
};

export function MonthCalendar({
  monthLabel,
  days,
  getTasksForDate,
  today,
  canEditTasks = true,
  onPrevMonth,
  onNextMonth,
  onDueDateChange,
}: MonthCalendarProps) {
  const [activeTask, setActiveTask] = useState<CalendarTask | null>(null);

  const validDates = useMemo(() => new Set(days.map((d) => d.date)), [days]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as CalendarTask | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const taskId = event.active.id as string;
      const overId = event.over?.id;
      if (!canEditTasks || !overId || typeof overId !== 'string' || !onDueDateChange) return;
      if (!validDates.has(overId)) return;
      const task = event.active.data.current?.task as CalendarTask | undefined;
      if (task?.dueDate === overId) return; // same date, no-op
      onDueDateChange(taskId, overId);
    },
    [canEditTasks, onDueDateChange, validDates],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CalendarMonthHeader
          monthLabel={monthLabel}
          onPrev={onPrevMonth}
          onNext={onNextMonth}
        />
        <CardContent className="space-y-4">
          <CalendarWeekdayRow />
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <CalendarDayCell
                key={day.date}
                day={day}
                tasks={getTasksForDate(day.date)}
                isToday={day.date === today}
                canEditTasks={canEditTasks}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <DragOverlay dropAnimation={null}>
        {canEditTasks && activeTask ? (
          <CalendarTaskChip task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

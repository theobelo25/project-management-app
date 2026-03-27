import type { TaskView } from '@repo/types';
import type { CalendarTask } from './types';

/**
 * Converts API TaskView to CalendarTask. Returns null if task has no due date
 * (those are omitted from the calendar).
 */
export function taskViewToCalendarTask(task: TaskView): CalendarTask | null {
  if (!task.dueDate) return null;
  const dateOnly = task.dueDate.slice(0, 10);
  return {
    id: task.id,
    title: task.title,
    dueDate: dateOnly,
    status: task.status,
  };
}

import type { TaskStatus } from '@repo/types';

export type BoardTask = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
};

export const BOARD_COLUMNS: { key: TaskStatus; title: string }[] = [
  { key: 'TODO', title: 'Todo' },
  { key: 'IN_PROGRESS', title: 'In Progress' },
  { key: 'REVIEW', title: 'Review' },
  { key: 'DONE', title: 'Done' },
];

export function groupTasksByStatus(
  tasks: BoardTask[],
): Record<TaskStatus, BoardTask[]> {
  const map: Record<TaskStatus, BoardTask[]> = {
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  };
  for (const task of tasks) {
    map[task.status].push(task);
  }
  return map;
}

/** Same column set as the board UI; API tasks use full `TaskStatus` (no slimmer column list). */
export const BOARD_COLUMNS_API: typeof BOARD_COLUMNS = BOARD_COLUMNS;

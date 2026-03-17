export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type BoardTask = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
};

export const BOARD_COLUMNS: { key: TaskStatus; title: string }[] = [
  { key: "TODO", title: "Todo" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "REVIEW", title: "Review" },
  { key: "DONE", title: "Done" },
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

export const BOARD_COLUMNS_API: { key: TaskStatus; title: string }[] = [
  { key: "TODO", title: "Todo" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "DONE", title: "Done" },
];

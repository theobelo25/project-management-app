export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskAssignee = {
  id: string;
  name: string;
  email?: string | null;
};

export type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assignee: TaskAssignee | null;
  updatedAt: string | Date;
};

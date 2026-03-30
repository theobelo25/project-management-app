import type { TaskLabelColor, TaskStatus } from '@repo/types';

export type CalendarTask = {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  labelColor: TaskLabelColor;
};

export type CalendarDay = {
  date: string;
  dayNumber: number;
  inMonth: boolean;
};

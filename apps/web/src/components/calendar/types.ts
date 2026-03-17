export type CalendarTaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type CalendarTask = {
  id: string;
  title: string;
  dueDate: string;
  status: CalendarTaskStatus;
};

export type CalendarDay = {
  date: string;
  dayNumber: number;
  inMonth: boolean;
};

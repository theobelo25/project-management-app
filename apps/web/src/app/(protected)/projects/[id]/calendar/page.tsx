"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Button } from "@web/components/ui/button";

type CalendarTask = {
  id: string;
  title: string;
  dueDate: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
};

const monthLabel = "March 2026";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calendarDays = [
  { date: "2026-03-01", dayNumber: 1, inMonth: true },
  { date: "2026-03-02", dayNumber: 2, inMonth: true },
  { date: "2026-03-03", dayNumber: 3, inMonth: true },
  { date: "2026-03-04", dayNumber: 4, inMonth: true },
  { date: "2026-03-05", dayNumber: 5, inMonth: true },
  { date: "2026-03-06", dayNumber: 6, inMonth: true },
  { date: "2026-03-07", dayNumber: 7, inMonth: true },

  { date: "2026-03-08", dayNumber: 8, inMonth: true },
  { date: "2026-03-09", dayNumber: 9, inMonth: true },
  { date: "2026-03-10", dayNumber: 10, inMonth: true },
  { date: "2026-03-11", dayNumber: 11, inMonth: true },
  { date: "2026-03-12", dayNumber: 12, inMonth: true },
  { date: "2026-03-13", dayNumber: 13, inMonth: true },
  { date: "2026-03-14", dayNumber: 14, inMonth: true },

  { date: "2026-03-15", dayNumber: 15, inMonth: true },
  { date: "2026-03-16", dayNumber: 16, inMonth: true },
  { date: "2026-03-17", dayNumber: 17, inMonth: true },
  { date: "2026-03-18", dayNumber: 18, inMonth: true },
  { date: "2026-03-19", dayNumber: 19, inMonth: true },
  { date: "2026-03-20", dayNumber: 20, inMonth: true },
  { date: "2026-03-21", dayNumber: 21, inMonth: true },

  { date: "2026-03-22", dayNumber: 22, inMonth: true },
  { date: "2026-03-23", dayNumber: 23, inMonth: true },
  { date: "2026-03-24", dayNumber: 24, inMonth: true },
  { date: "2026-03-25", dayNumber: 25, inMonth: true },
  { date: "2026-03-26", dayNumber: 26, inMonth: true },
  { date: "2026-03-27", dayNumber: 27, inMonth: true },
  { date: "2026-03-28", dayNumber: 28, inMonth: true },

  { date: "2026-03-29", dayNumber: 29, inMonth: true },
  { date: "2026-03-30", dayNumber: 30, inMonth: true },
  { date: "2026-03-31", dayNumber: 31, inMonth: true },
  { date: "2026-04-01", dayNumber: 1, inMonth: false },
  { date: "2026-04-02", dayNumber: 2, inMonth: false },
  { date: "2026-04-03", dayNumber: 3, inMonth: false },
  { date: "2026-04-04", dayNumber: 4, inMonth: false },
];

const dummyTasks: CalendarTask[] = [
  {
    id: "1",
    title: "Build task API",
    dueDate: "2026-03-04",
    status: "TODO",
  },
  {
    id: "2",
    title: "Implement auth refresh flow",
    dueDate: "2026-03-10",
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    title: "Create board UI",
    dueDate: "2026-03-14",
    status: "REVIEW",
  },
  {
    id: "4",
    title: "Finish project overview",
    dueDate: "2026-03-18",
    status: "DONE",
  },
  {
    id: "5",
    title: "Add calendar page",
    dueDate: "2026-03-20",
    status: "IN_PROGRESS",
  },
  {
    id: "6",
    title: "Wire drag and drop",
    dueDate: "2026-03-24",
    status: "TODO",
  },
  {
    id: "7",
    title: "Task detail dialog",
    dueDate: "2026-03-27",
    status: "TODO",
  },
];

function getTasksForDate(date: string) {
  return dummyTasks.filter((task) => task.dueDate === date);
}

function getStatusBadgeClasses(status: CalendarTask["status"]) {
  switch (status) {
    case "TODO":
      return "bg-muted text-muted-foreground";
    case "IN_PROGRESS":
      return "bg-primary/10 text-primary";
    case "REVIEW":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    case "DONE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function ProjectCalendarPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Project Calendar</h1>
          <p className="text-sm text-muted-foreground">
            View task deadlines by date
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">Today</Button>
          <Button variant="outline">New Task</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>{monthLabel}</CardTitle>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Prev
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="rounded-md px-2 py-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const tasks = getTasksForDate(day.date);
              const isToday = day.date === "2026-03-15";

              return (
                <div
                  key={day.date}
                  className={[
                    "min-h-36 rounded-lg border p-2",
                    day.inMonth ? "bg-background" : "bg-muted/30",
                    isToday ? "ring-2 ring-primary" : "",
                  ].join(" ")}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={[
                        "text-sm font-medium",
                        day.inMonth
                          ? "text-foreground"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {day.dayNumber}
                    </span>

                    {tasks.length > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        {tasks.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        className="rounded-md border px-2 py-1 text-left text-xs transition hover:bg-muted"
                        type="button"
                      >
                        <div className="truncate font-medium">{task.title}</div>
                        <div
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusBadgeClasses(task.status)}`}
                        >
                          {task.status.replace("_", " ")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { getCalendarTaskStatusClasses } from "./format";
import type { CalendarTask } from "./types";

type CalendarTaskChipProps = {
  task: CalendarTask;
  onClick?: () => void;
};

export function CalendarTaskChip({ task, onClick }: CalendarTaskChipProps) {
  return (
    <button
      className="rounded-md border px-2 py-1 text-left text-xs transition hover:bg-muted"
      type="button"
      onClick={onClick}
    >
      <div className="truncate font-medium">{task.title}</div>
      <div
        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getCalendarTaskStatusClasses(task.status)}`}
      >
        {task.status.replace("_", " ")}
      </div>
    </button>
  );
}

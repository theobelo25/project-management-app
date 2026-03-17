"use client";

import { useDroppable } from "@dnd-kit/core";
import { CalendarTaskChip } from "./calendar-task-chip";
import type { CalendarDay, CalendarTask } from "./types";

type CalendarDayCellProps = {
  day: CalendarDay;
  tasks: CalendarTask[];
  isToday: boolean;
};

export function CalendarDayCell({ day, tasks, isToday }: CalendarDayCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id: day.date });

  return (
    <div
      ref={setNodeRef}
      className={[
        "min-h-36 rounded-lg border p-2 transition-colors",
        day.inMonth ? "bg-background" : "bg-muted/30",
        isToday ? "ring-2 ring-primary" : "",
        isOver ? "ring-2 ring-primary bg-primary/5" : "",
      ].join(" ")}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={[
            "text-sm font-medium",
            day.inMonth ? "text-foreground" : "text-muted-foreground",
          ].join(" ")}
        >
          {day.dayNumber}
        </span>

        {tasks.length > 0 ? (
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <CalendarTaskChip key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

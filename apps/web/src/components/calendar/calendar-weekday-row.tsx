"use client";

import { WEEK_DAYS } from "./constants";

export function CalendarWeekdayRow() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {WEEK_DAYS.map((day) => (
        <div
          key={day}
          className="rounded-md px-2 py-2 text-center text-sm font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}
    </div>
  );
}

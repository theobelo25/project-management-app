"use client";

import { Card, CardContent } from "@web/components/ui/card";
import { CalendarDayCell } from "./calendar-day-cell";
import { CalendarMonthHeader } from "./calendar-month-header";
import { CalendarWeekdayRow } from "./calendar-weekday-row";
import type { CalendarDay, CalendarTask } from "./types";

type MonthCalendarProps = {
  monthLabel: string;
  days: CalendarDay[];
  getTasksForDate: (date: string) => CalendarTask[];
  today: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
};

export function MonthCalendar({
  monthLabel,
  days,
  getTasksForDate,
  today,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  return (
    <Card>
      <CalendarMonthHeader
        monthLabel={monthLabel}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
      />
      <CardContent className="space-y-4">
        <CalendarWeekdayRow />
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <CalendarDayCell
              key={day.date}
              day={day}
              tasks={getTasksForDate(day.date)}
              isToday={day.date === today}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

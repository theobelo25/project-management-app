import type { CalendarDay } from "./types";

/**
 * Builds the grid of calendar days for a month (6 rows × 7 columns).
 * Includes leading/trailing days from adjacent months; inMonth marks current month.
 */
export function getCalendarDaysForMonth(
  year: number,
  month: number,
): CalendarDay[] {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const startOffset = startDay;
  const daysInMonth = new Date(year, month, 0).getDate();

  const result: CalendarDay[] = [];
  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const dayDate = new Date(year, month - 1, 1);
    dayDate.setDate(1 - startOffset + i);

    const y = dayDate.getFullYear();
    const m = dayDate.getMonth() + 1;
    const d = dayDate.getDate();
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    result.push({
      date: dateStr,
      dayNumber: dayDate.getDate(),
      inMonth: dayDate.getMonth() + 1 === month,
    });
  }

  return result;
}

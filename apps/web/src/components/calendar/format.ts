import type { TaskStatus } from '@repo/types';

export function getCalendarTaskStatusClasses(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'bg-muted text-muted-foreground';
    case 'IN_PROGRESS':
      return 'bg-primary/10 text-primary';
    case 'REVIEW':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
    case 'DONE':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function formatMonthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(d);
}
export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** `YYYY-MM-DD` → e.g. "Thu, Apr 2" for agenda headings */
export function formatAgendaDayHeading(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

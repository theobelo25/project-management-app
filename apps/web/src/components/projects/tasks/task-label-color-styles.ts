import type { TaskLabelColor } from '@repo/types';

/** Solid fill for swatches and chips (Tailwind). */
export const TASK_LABEL_COLOR_SWATCH_CLASS: Record<TaskLabelColor, string> = {
  NONE: 'bg-muted-foreground/25',
  SLATE: 'bg-slate-500',
  RED: 'bg-red-500',
  ORANGE: 'bg-orange-500',
  AMBER: 'bg-amber-500',
  GREEN: 'bg-green-600',
  BLUE: 'bg-blue-500',
  VIOLET: 'bg-violet-500',
  ROSE: 'bg-rose-500',
};

/** Left accent on cards / rows. */
export const TASK_LABEL_COLOR_BORDER_CLASS: Record<TaskLabelColor, string> = {
  NONE: '',
  SLATE: 'border-l-4 border-l-slate-500',
  RED: 'border-l-4 border-l-red-500',
  ORANGE: 'border-l-4 border-l-orange-500',
  AMBER: 'border-l-4 border-l-amber-500',
  GREEN: 'border-l-4 border-l-green-600',
  BLUE: 'border-l-4 border-l-blue-500',
  VIOLET: 'border-l-4 border-l-violet-500',
  ROSE: 'border-l-4 border-l-rose-500',
};

export const TASK_LABEL_COLOR_OPTIONS: {
  value: TaskLabelColor;
  label: string;
}[] = [
  { value: 'NONE', label: 'None' },
  { value: 'SLATE', label: 'Slate' },
  { value: 'RED', label: 'Red' },
  { value: 'ORANGE', label: 'Orange' },
  { value: 'AMBER', label: 'Amber' },
  { value: 'GREEN', label: 'Green' },
  { value: 'BLUE', label: 'Blue' },
  { value: 'VIOLET', label: 'Violet' },
  { value: 'ROSE', label: 'Rose' },
];

export function formatTaskLabelColor(color: TaskLabelColor): string {
  const found = TASK_LABEL_COLOR_OPTIONS.find((o) => o.value === color);
  return found?.label ?? color;
}

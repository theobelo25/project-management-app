import { Calendar, Circle, Flag, Hash, Palette, User } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { TaskView } from '@repo/types';

import {
  formatTaskLabelColor,
  TASK_LABEL_COLOR_SWATCH_CLASS,
} from '../tasks/task-label-color-styles';
import { formatTaskPriority, formatTaskStatus } from '../utils/format';
import { cn } from '@web/lib/utils';

function formatDueDate(iso: string | null): string {
  if (!iso) return 'No due date';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(d);
}

type TaskDetailsCardProps = {
  task: Pick<
    TaskView,
    'id' | 'description' | 'status' | 'priority' | 'labelColor' | 'dueDate'
  >;
  assignee?: {
    name: string;
  } | null;
};

export function TaskDetailsCard({ task, assignee }: TaskDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Details</CardTitle>
        <CardDescription>
          Description and current work context for this task.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Description
          </h2>
          <div className="rounded-xl border bg-muted/20 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6">
              {task.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border p-4">
            <dt className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Circle className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm">Status</span>
            </dt>
            <dd className="font-medium">{formatTaskStatus(task.status)}</dd>
          </div>

          <div className="rounded-xl border p-4">
            <dt className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Flag className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm">Priority</span>
            </dt>
            <dd className="font-medium">{formatTaskPriority(task.priority)}</dd>
          </div>

          <div className="rounded-xl border p-4">
            <dt className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Palette className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm">Label color</span>
            </dt>
            <dd className="flex flex-wrap items-center gap-2 font-medium">
              <span
                className={cn(
                  'inline-block h-4 w-4 shrink-0 rounded-full',
                  TASK_LABEL_COLOR_SWATCH_CLASS[task.labelColor],
                )}
                aria-hidden
              />
              {formatTaskLabelColor(task.labelColor)}
            </dd>
          </div>

          <div className="rounded-xl border p-4">
            <dt className="mb-2 flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm">Assignee</span>
            </dt>
            <dd className="font-medium">{assignee?.name || 'Unassigned'}</dd>
          </div>

          <div className="rounded-xl border p-4">
            <dt className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm">Due date</span>
            </dt>
            <dd className="font-medium">
              {formatDueDate(task.dueDate ?? null)}
            </dd>
          </div>

          <div className="rounded-xl border p-4">
            <dt className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm">Task ID</span>
            </dt>
            <dd className="break-all font-mono text-sm font-medium leading-relaxed">
              {task.id}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

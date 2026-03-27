import { Calendar, Circle, User, Hash } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { TaskView } from '@repo/types';

import { formatTaskStatus } from '../utils/format';

function formatDueDate(iso: string | null): string {
  if (!iso) return 'No due date';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(d);
}

type TaskDetailsCardProps = {
  task: Pick<TaskView, 'id' | 'description' | 'status' | 'dueDate'>;
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Circle className="h-4 w-4" />
              <span className="text-sm">Status</span>
            </div>
            <p className="font-medium">{formatTaskStatus(task.status)}</p>
          </div>

          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">Assignee</span>
            </div>
            <p className="font-medium">{assignee?.name || 'Unassigned'}</p>
          </div>

          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Due date</span>
            </div>
            <p className="font-medium">{formatDueDate(task.dueDate ?? null)}</p>
          </div>

          <div className="rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span className="text-sm">Task ID</span>
            </div>
            <p className="truncate font-medium">{task.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';

import {
  TASK_LABEL_COLOR_BORDER_CLASS,
  TASK_LABEL_COLOR_SWATCH_CLASS,
} from '@web/components/projects/tasks/task-label-color-styles';
import { formatTaskStatus } from '@web/components/projects/utils';
import { cn } from '@web/lib/utils';
import { Badge } from '@web/components/ui/badge';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { ProjectDetailView, ProjectRecentTask } from '@repo/types';

export interface RecentTasksCardProps {
  project: Pick<ProjectDetailView, 'id'>;
  recentTasks: ProjectRecentTask[];
  allowTaskDetailNavigation?: boolean;
}

export function RecentTasksCard({
  project,
  recentTasks,
  allowTaskDetailNavigation = true,
}: RecentTasksCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>
            A quick view of work happening inside this project.
          </CardDescription>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href={`/projects/${project.id}/tasks`}>View all tasks</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentTasks.length > 0 ? (
          recentTasks.map((task) =>
            allowTaskDetailNavigation ? (
              <Link
                key={task.id}
                href={`/projects/${project.id}/tasks/${task.id}`}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg border p-4',
                  TASK_LABEL_COLOR_BORDER_CLASS[task.labelColor],
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      TASK_LABEL_COLOR_SWATCH_CLASS[task.labelColor],
                    )}
                    aria-hidden
                  />
                  <p className="truncate font-medium">{task.title}</p>
                </div>
                <Badge variant="outline">{formatTaskStatus(task.status)}</Badge>
              </Link>
            ) : (
              <div
                key={task.id}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg border p-4',
                  TASK_LABEL_COLOR_BORDER_CLASS[task.labelColor],
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      TASK_LABEL_COLOR_SWATCH_CLASS[task.labelColor],
                    )}
                    aria-hidden
                  />
                  <p className="truncate font-medium">{task.title}</p>
                </div>
                <Badge variant="outline">{formatTaskStatus(task.status)}</Badge>
              </div>
            ),
          )
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No tasks yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

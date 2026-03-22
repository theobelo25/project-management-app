import Link from 'next/link';

import {
  type TaskListItem,
  TaskRowActions,
  TasksEmptyState,
} from '@web/components/projects/tasks';
import {
  formatTaskStatus,
  formatUpdatedAt,
  getStatusBadgeVariant,
} from '@web/components/projects/utils';
import { Badge } from '@web/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';

type TasksTableProps = {
  projectId: string;
  tasks: TaskListItem[];
  onDelete?: (taskId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function TasksTable({
  projectId,
  tasks,
  onDelete,
  emptyTitle = 'No tasks yet',
  emptyDescription = 'Create your first task to start tracking work in this project.',
}: TasksTableProps) {
  if (tasks.length === 0) {
    return (
      <TasksEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="hidden md:block">
          <div className="grid grid-cols-[minmax(0,2fr)_160px_180px_140px_56px] items-center gap-4 border-b px-6 py-3 text-sm font-medium text-muted-foreground">
            <div>Title</div>
            <div>Status</div>
            <div>Assignee</div>
            <div>Updated</div>
            <div />
          </div>

          <div className="divide-y">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[minmax(0,2fr)_160px_180px_140px_56px] items-center gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/projects/${projectId}/tasks/${task.id}`}
                    className="block"
                  >
                    <p className="truncate font-medium hover:underline">
                      {task.title}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {task.description || 'No description provided.'}
                    </p>
                  </Link>
                </div>

                <div>
                  <Badge variant={getStatusBadgeVariant(task.status)}>
                    {formatTaskStatus(task.status)}
                  </Badge>
                </div>

                <div className="truncate text-sm text-muted-foreground">
                  {task.assignee?.name || 'Unassigned'}
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatUpdatedAt(task.updatedAt)}
                </div>

                <div className="flex justify-end">
                  <TaskRowActions
                    projectId={projectId}
                    taskId={task.id}
                    task={{
                      id: task.id,
                      title: task.title,
                      description: task.description,
                      dueDate: task.dueDate ?? null,
                    }}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y md:hidden">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/projects/${projectId}/tasks/${task.id}`}
                    className="block"
                  >
                    <p className="truncate font-medium hover:underline">
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.description || 'No description provided.'}
                    </p>
                  </Link>
                </div>

                <TaskRowActions
                  projectId={projectId}
                  taskId={task.id}
                  task={{
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate ?? null,
                  }}
                  onDelete={onDelete}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={getStatusBadgeVariant(task.status)}>
                  {formatTaskStatus(task.status)}
                </Badge>
                <span>•</span>
                <span>{task.assignee?.name || 'Unassigned'}</span>
                <span>•</span>
                <span>{formatUpdatedAt(task.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';
import type { TaskStatus } from '@repo/types';
import { formatTaskStatus } from '@web/components/projects/utils';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

type TaskItem = { id: string; title: string; status: TaskStatus };
type Props = { tasks: TaskItem[] };

export function DashboardTasksCard({ tasks }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>
          A quick snapshot of what needs attention.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatTaskStatus(task.status)}
              </p>
            </div>
          </div>
        ))}

        <Button asChild variant="outline" className="w-full">
          <Link href="/tasks">View all tasks</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

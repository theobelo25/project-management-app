import Link from 'next/link';
import { Pencil } from 'lucide-react';

import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';

type TaskQuickActionsCardProps = {
  projectId: string;
  setEditOpen: (open: boolean) => void;
  onMarkComplete?: () => void;
  onDelete?: () => void;
};

export function TaskQuickActionsCard({
  projectId,
  setEditOpen,
  onMarkComplete,
  onDelete,
}: TaskQuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common actions for managing this task.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          type="button"
          className="w-full"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Task
        </Button>
        {onMarkComplete && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onMarkComplete}
          >
            Mark as Complete
          </Button>
        )}
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={onDelete}
          >
            Delete Task
          </Button>
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href={`/projects/${projectId}/tasks`}>Back to all tasks</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

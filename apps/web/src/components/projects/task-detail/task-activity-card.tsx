import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

import { formatDate, formatDistanceToNow } from "../utils/format";

type TaskActivityCardProps = {
  task: {
    createdAt: string;
    updatedAt: string;
  };
};

export function TaskActivityCard({ task }: TaskActivityCardProps) {
  const createdAt = new Date(task.createdAt);
  const updatedAt = new Date(task.updatedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Timing information for this task.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created</span>
          </div>
          <span className="text-right font-medium">
            {formatDate(createdAt.toISOString())}
          </span>
          <span className="text-right text-xs text-muted-foreground">
            {formatDistanceToNow(createdAt)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last updated</span>
          </div>
          <span className="text-right font-medium">
            {formatDate(updatedAt.toISOString())}
          </span>
          <span className="text-right text-xs text-muted-foreground">
            {formatDistanceToNow(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

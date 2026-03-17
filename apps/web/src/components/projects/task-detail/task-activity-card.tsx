import { Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

import { formatDate, formatDistanceToNow } from "../utils/format";

function formatDueDate(iso: string | null): string {
  if (!iso) return "No due date";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d);
}

type TaskActivityCardProps = {
  task: {
    createdAt: string;
    updatedAt: string;
    dueDate?: string | null;
  };
};

export function TaskActivityCard({ task }: TaskActivityCardProps) {
  const createdAt = new Date(task.createdAt);
  const updatedAt = new Date(task.updatedAt);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Timing information for this task.</CardDescription>
      </CardHeader>

      <CardContent className="text-sm">
        <div className="grid grid-cols-[auto_minmax(10rem,1fr)_auto] items-center gap-x-6 gap-y-4">
          {/* Header row - optional, or just use first row as template */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Created</span>
          </div>
          <span className="font-medium tabular-nums">
            {formatDate(createdAt.toISOString())}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDistanceToNow(createdAt)}
          </span>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Last updated</span>
          </div>
          <span className="font-medium tabular-nums">
            {formatDate(updatedAt.toISOString())}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDistanceToNow(updatedAt)}
          </span>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Due date</span>
          </div>
          <span className="font-medium tabular-nums">
            {dueDate ? formatDate(dueDate.toISOString()) : "—"}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {dueDate ? formatDistanceToNow(dueDate) : "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

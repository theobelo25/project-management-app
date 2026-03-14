import { Badge } from "@web/components/ui/badge";
import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import Link from "next/link";
import { ProjectDetailView, ProjectRecentTask } from "@repo/types";

type ProjectTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

function formatTaskStatus(status: ProjectTask["status"]) {
  switch (status) {
    case "TODO":
      return "Todo";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

export interface RecentTasksCardProps {
  project: Pick<ProjectDetailView, "id">;
  recentTasks: ProjectRecentTask[];
}

export function RecentTasksCard({
  project,
  recentTasks,
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
          recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTaskStatus(task.status)}
                </p>
              </div>

              <Badge variant="outline">{formatTaskStatus(task.status)}</Badge>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No tasks yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

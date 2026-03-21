import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

function formatStatus(status: string): string {
  if (status === "IN_PROGRESS") return "In progress";
  if (status === "TODO") return "Todo";
  if (status === "REVIEW") return "Review";
  if (status === "DONE") return "Done";
  return status;
}

type TaskItem = { id: string; title: string; status: string };
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
              {formatStatus(task.status)}
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

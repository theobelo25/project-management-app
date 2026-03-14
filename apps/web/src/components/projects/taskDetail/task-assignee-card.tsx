import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type TaskAssigneeCardProps = {
  assignee: {
    name: string;
    email: string;
  } | null;
};

export function TaskAssigneeCard({ assignee }: TaskAssigneeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignee</CardTitle>
        <CardDescription>
          The person currently responsible for this task.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {assignee ? (
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground">
              {getInitials(assignee.name)}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium">{assignee.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {assignee.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            This task has not been assigned yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

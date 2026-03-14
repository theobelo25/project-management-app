import { ClipboardList } from "lucide-react";

type TasksEmptyStateProps = {
  title?: string;
  description?: string;
};

export function TasksEmptyState({
  title = "No tasks yet",
  description = "Create your first task to start tracking work in this project.",
}: TasksEmptyStateProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

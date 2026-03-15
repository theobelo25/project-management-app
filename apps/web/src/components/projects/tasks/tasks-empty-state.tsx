import { ClipboardList } from "lucide-react";

import { EmptyStateCard } from "../empty-state-card";

type TasksEmptyStateProps = {
  title?: string;
  description?: string;
};

export function TasksEmptyState({
  title = "No tasks yet",
  description = "Create your first task to start tracking work in this project.",
}: TasksEmptyStateProps) {
  return (
    <EmptyStateCard
      icon={<ClipboardList className="h-6 w-6 text-muted-foreground" />}
      title={title}
      description={description}
      minHeight="min-h-[320px]"
    />
  );
}

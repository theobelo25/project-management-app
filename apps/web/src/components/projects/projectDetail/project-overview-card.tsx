import { CreateTaskDialog } from "@web/components/tasks/create-task-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { ProjectDetailView, ProjectRole } from "@repo/types";

function formatRole(role: ProjectRole | undefined): string {
  if (!role) return "Member";
  switch (role) {
    case "OWNER":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "MEMBER":
      return "Member";
    default:
      return role;
  }
}

export interface ProjectOverviewCardProps {
  project: Pick<ProjectDetailView, "id" | "currentUserRole">;
  openTasks: number;
}

export function ProjectOverviewCard({
  project,
  openTasks,
}: ProjectOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Basic project information and quick actions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium">
            {formatRole(project.currentUserRole)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Project ID</span>
          <span className="font-medium">{project.id}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Open tasks</span>
          <span className="font-medium">{openTasks}</span>
        </div>

        <div className="pt-2">
          <CreateTaskDialog projectId={project.id} />
        </div>
      </CardContent>
    </Card>
  );
}

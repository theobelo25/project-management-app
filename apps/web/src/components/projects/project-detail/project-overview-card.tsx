import { CreateTaskDialog } from '@web/components/projects/tasks';
import { formatProjectRole } from '@web/components/projects/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { ProjectDetailView } from '@repo/types';

export interface ProjectOverviewCardProps {
  project: Pick<ProjectDetailView, 'id' | 'currentUserRole'>;
}

export function ProjectOverviewCard({ project }: ProjectOverviewCardProps) {
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
            {formatProjectRole(project.currentUserRole)}
          </span>
        </div>
        <div className="pt-2">
          <CreateTaskDialog projectId={project.id} />
        </div>
      </CardContent>
    </Card>
  );
}

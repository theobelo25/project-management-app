import { useState } from 'react';
import {
  ArchiveButton,
  DeleteProjectDialog,
  SettingsActionRow,
} from '@web/components/projects/settings';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { useDeleteProject } from '@web/lib/api/mutations/use-delete-project';

type DangerZoneCardProps = {
  project: {
    id: string;
    archivedAt: string | null;
    name: string;
  };
  canDeleteProject: boolean;
};

export function DangerZoneCard({
  project,
  canDeleteProject,
}: DangerZoneCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useDeleteProject(project.id, {
    onSuccess: () => setDeleteDialogOpen(false),
  });

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          These actions can permanently affect this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingsActionRow
          variant="destructive"
          title="Delete Project"
          description="Permanently remove this project and its associated data. This action cannot be undone."
        >
          <DeleteProjectDialog
            projectName={project.name}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            canDeleteProject={canDeleteProject}
            deleteMutation={deleteMutation}
          />
        </SettingsActionRow>
        {!canDeleteProject ? (
          <p className="text-sm text-muted-foreground">
            Only the project owner can delete this project.
          </p>
        ) : null}

        <SettingsActionRow
          title="Archive Project"
          description="Hide this project from active views while keeping its data available for later reference."
        >
          <ArchiveButton
            projectId={project.id}
            archivedAt={project.archivedAt}
          />
        </SettingsActionRow>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ArchiveButton,
  DeleteProjectDialog,
  SettingsActionRow,
} from "@web/components/projects/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { deleteProject } from "@web/lib/api/client";
import { PROJECT_QUERY_KEY, PROJECTS_QUERY_KEY } from "@web/lib/api/queries";
import { ROUTES } from "@web/lib/routes";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: PROJECT_QUERY_KEY(project.id) });
      toast.success("Project deleted successfully.");
      setDeleteDialogOpen(false);
      router.push(ROUTES.projects);
    },
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

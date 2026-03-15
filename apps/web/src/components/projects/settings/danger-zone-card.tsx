import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { ArchiveButton } from "./archive-button";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteProject } from "@web/lib/api/client";
import { PROJECT_QUERY_KEY, PROJECTS_QUERY_KEY } from "@web/lib/api/queries";
import { ROUTES } from "@web/lib/routes";
import { toast } from "sonner";

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
        <div className="rounded-xl border border-destructive/20 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium">Delete Project</p>
              <p className="text-sm text-muted-foreground">
                Permanently remove this project and its associated data. This
                action cannot be undone.
              </p>
            </div>
            <DeleteProjectDialog
              projectName={project.name}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              canDeleteProject={canDeleteProject}
              deleteMutation={deleteMutation}
            />
          </div>
          {!canDeleteProject ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Only the project owner can delete this project.
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium">Archive Project</p>
              <p className="text-sm text-muted-foreground">
                Hide this project from active views while keeping its data
                available for later reference.
              </p>
            </div>
            <ArchiveButton
              projectId={project.id}
              archivedAt={project.archivedAt}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

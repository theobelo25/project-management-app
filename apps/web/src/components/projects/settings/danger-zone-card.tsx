import { Button } from "@web/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { Trash2 } from "lucide-react";
import { ArchiveButton } from "./archive-button";

type DangerZoneCardProps = {
  project: {
    id: string;
    archivedAt: string | null;
  };
  canDeleteProject: boolean;
};

export function DangerZoneCard({
  project,
  canDeleteProject,
}: DangerZoneCardProps) {
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
            <Button
              type="button"
              variant="destructive"
              disabled={!canDeleteProject}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
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

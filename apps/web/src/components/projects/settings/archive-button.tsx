import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import { archiveProject, unarchiveProject } from "@web/lib/api/client";
import { PROJECT_QUERY_KEY, PROJECTS_QUERY_KEY } from "@web/lib/api/queries";

export function ArchiveButton({
  projectId,
  archivedAt,
}: {
  projectId: string;
  archivedAt: string | null;
}) {
  const queryClient = useQueryClient();
  const archiveMutation = useMutation({
    mutationFn: () => archiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast.success("Project archived successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to archive project");
    },
  });
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast.success("Project unarchived successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unarchive project");
    },
  });
  if (archivedAt) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => unarchiveMutation.mutate()}
        disabled={unarchiveMutation.isPending}
      >
        Unarchive Project
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => archiveMutation.mutate()}
      disabled={archiveMutation.isPending}
    >
      Archive Project
    </Button>
  );
}

import { Button } from '@web/components/ui/button';
import {
  useArchiveProject,
  useUnarchiveProject,
} from '@web/lib/api/mutations/use-archive-project';

export function ArchiveButton({
  projectId,
  archivedAt,
}: {
  projectId: string;
  archivedAt: string | null;
}) {
  const archiveMutation = useArchiveProject(projectId);
  const unarchiveMutation = useUnarchiveProject(projectId);

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

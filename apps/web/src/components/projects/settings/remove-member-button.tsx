import { Button } from "@web/components/ui/button";
import { useRemoveProjectMember } from "@web/lib/api/mutations/use-remove-project-member";

export function RemoveMemberButton({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const removeMutation = useRemoveProjectMember(projectId);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => removeMutation.mutate(userId)}
      disabled={removeMutation.isPending}
    >
      {removeMutation.isPending ? "Removing…" : "Remove"}
    </Button>
  );
}

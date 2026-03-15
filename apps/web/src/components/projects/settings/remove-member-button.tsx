import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import { removeProjectMember } from "@web/lib/api/client";
import {
  PROJECT_MEMBERS_QUERY_KEY,
  PROJECT_QUERY_KEY,
} from "@web/lib/api/queries";

export function RemoveMemberButton({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const removeMutation = useMutation({
    mutationFn: () => removeProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEY(projectId) });
      queryClient.invalidateQueries({
        queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
      });
      toast.success("Member removed successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove member.");
    },
  });
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => removeMutation.mutate()}
      disabled={removeMutation.isPending}
    >
      Remove
    </Button>
  );
}

'use client';

import { LogOut, Trash2 } from 'lucide-react';

import { Button } from '@web/components/ui/button';

type OrganizationDetailDangerZoneProps = {
  canDelete: boolean;
  onLeaveClick: () => void;
  onDeleteClick: () => void;
  leavePending: boolean;
  deletePending: boolean;
};

export function OrganizationDetailDangerZone({
  canDelete,
  onLeaveClick,
  onDeleteClick,
  leavePending,
  deletePending,
}: OrganizationDetailDangerZoneProps) {
  return (
    <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Danger zone</h3>
        <p className="text-xs text-muted-foreground">
          {canDelete
            ? 'Delete this organization permanently. This cannot be undone.'
            : 'Leave this organization and remove your membership.'}
        </p>
      </div>

      {canDelete ? (
        <Button
          type="button"
          variant="destructive"
          onClick={onDeleteClick}
          disabled={deletePending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete organization
        </Button>
      ) : (
        <Button
          type="button"
          variant="destructive"
          onClick={onLeaveClick}
          disabled={leavePending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Leave organization
        </Button>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web/components/ui/dialog';
import { Badge } from '@web/components/ui/badge';
import { Separator } from '@web/components/ui/separator';
import { OrganizationConfirmDialog } from '@web/components/organizations/organization-confirm-dialog';
import { OrganizationDetailAddMemberSection } from '@web/components/organizations/organization-detail-add-member-section';
import { OrganizationDetailDangerZone } from '@web/components/organizations/organization-detail-danger-zone';
import { OrganizationDetailMembersSection } from '@web/components/organizations/organization-detail-members-section';
import {
  formatJoinedAt,
  getRoleBadgeVariant,
  getRoleIcon,
} from '@web/components/organizations/organization-role-display';
import type { UserSearchResult } from '@web/components/projects/members';
import {
  useDeleteOrganizationMutation,
  useCreateOrganizationInviteMutation,
  useLeaveOrganizationMutation,
  useOrganizationQuery,
} from '@web/lib/api/queries';
import { toast } from 'sonner';

type OrganizationDetailDialogProps = {
  organizationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeOrganizationId: string | null;
};

function OrganizationDetailDialogBody({
  organizationId,
  open,
  onOpenChange,
  activeOrganizationId,
}: OrganizationDetailDialogProps) {
  const detailQuery = useOrganizationQuery(
    organizationId,
    open && !!organizationId,
  );
  const inviteMutation = useCreateOrganizationInviteMutation();
  const leaveOrganizationMutation = useLeaveOrganizationMutation();
  const deleteOrganizationMutation = useDeleteOrganizationMutation();

  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null,
  );

  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const organization = detailQuery.data ?? null;
  const isActiveOrganization =
    !!organization && activeOrganizationId === organization.id;

  const canAddMembers =
    organization?.role === 'OWNER' || organization?.role === 'ADMIN';
  const canDelete = organization?.role === 'OWNER';

  async function handleLeaveOrganization() {
    if (!organization) return;

    try {
      await leaveOrganizationMutation.mutateAsync(organization.id);
      toast.success(`Left ${organization.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to leave organization',
      );
      throw error;
    }
  }

  async function handleDeleteOrganization() {
    if (!organization) return;

    try {
      await deleteOrganizationMutation.mutateAsync(organization.id);
      toast.success(`Deleted ${organization.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete organization',
      );
      throw error;
    }
  }

  async function handleSendInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!organization || !selectedUser) return;

    try {
      await inviteMutation.mutateAsync({
        email: selectedUser.email,
      });
      toast.success(
        'Invite sent. They can accept it from their notifications.',
      );
      setSelectedUser(null);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send invite',
      );
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          onOpenChange(nextOpen);
          if (!nextOpen) {
            setSelectedUser(null);
            setLeaveConfirmOpen(false);
            setDeleteConfirmOpen(false);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Organization details</DialogTitle>
            <DialogDescription>
              View members and invite people by email. They must accept the
              invite before joining.
            </DialogDescription>
          </DialogHeader>

          {detailQuery.isPending ? (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Loading organization details...
            </div>
          ) : detailQuery.isError || !organization ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
              Failed to load organization details.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{organization.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Joined {formatJoinedAt(organization.joinedAt)}
                  </p>
                </div>

                <Badge
                  variant={getRoleBadgeVariant(organization.role)}
                  className="inline-flex items-center gap-1"
                >
                  {getRoleIcon(organization.role)}
                  {organization.role}
                </Badge>
              </div>

              <OrganizationDetailMembersSection
                members={organization.members}
              />

              <Separator />

              <OrganizationDetailAddMemberSection
                organizationId={organization.id}
                members={organization.members}
                canAddMembers={canAddMembers}
                isActiveOrganization={isActiveOrganization}
                selectedUser={selectedUser}
                onSelectedUserChange={setSelectedUser}
                onSubmit={(e) => {
                  void handleSendInvite(e);
                }}
                isPending={inviteMutation.isPending}
              />

              <Separator />

              <OrganizationDetailDangerZone
                canDelete={canDelete}
                onLeaveClick={() => setLeaveConfirmOpen(true)}
                onDeleteClick={() => setDeleteConfirmOpen(true)}
                leavePending={leaveOrganizationMutation.isPending}
                deletePending={deleteOrganizationMutation.isPending}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <OrganizationConfirmDialog
        open={leaveConfirmOpen}
        onOpenChange={setLeaveConfirmOpen}
        title="Leave organization"
        description={
          organization
            ? `Are you sure you want to leave ${organization.name}?`
            : 'Are you sure you want to leave this organization?'
        }
        confirmLabel="Leave organization"
        variant="destructive"
        isPending={leaveOrganizationMutation.isPending}
        onConfirm={handleLeaveOrganization}
      />

      <OrganizationConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete organization"
        description={
          organization
            ? `This will permanently delete ${organization.name}. This action cannot be undone.`
            : 'This will permanently delete the organization. This action cannot be undone.'
        }
        confirmLabel="Delete organization"
        variant="destructive"
        isPending={deleteOrganizationMutation.isPending}
        onConfirm={handleDeleteOrganization}
      />
    </>
  );
}

export function OrganizationDetailDialog(props: OrganizationDetailDialogProps) {
  return (
    <OrganizationDetailDialogBody
      key={props.organizationId ?? 'none'}
      {...props}
    />
  );
}

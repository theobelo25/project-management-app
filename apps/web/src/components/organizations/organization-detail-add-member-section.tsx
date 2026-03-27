'use client';

import { UserPlus } from 'lucide-react';

import type { OrganizationMemberView } from '@repo/types';
import { Button } from '@web/components/ui/button';
import { Badge } from '@web/components/ui/badge';
import { Label } from '@web/components/ui/label';
import {
  UserSearchCombobox,
  type UserSearchResult,
} from '@web/components/projects/members';

type OrganizationDetailAddMemberSectionProps = {
  organizationId: string;
  members: OrganizationMemberView[];
  canAddMembers: boolean;
  isActiveOrganization: boolean;
  selectedUser: UserSearchResult | null;
  onSelectedUserChange: (user: UserSearchResult | null) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
};

export function OrganizationDetailAddMemberSection({
  organizationId,
  members,
  canAddMembers,
  isActiveOrganization,
  selectedUser,
  onSelectedUserChange,
  onSubmit,
  isPending,
}: OrganizationDetailAddMemberSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium">Invite by email</h3>
        {canAddMembers ? (
          <Badge variant="outline">Invites can be sent</Badge>
        ) : (
          <Badge variant="outline">Read only</Badge>
        )}
      </div>

      {canAddMembers ? (
        isActiveOrganization ? (
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor={`organization-user-search-${organizationId}`}>
                User
              </Label>

              <UserSearchCombobox
                key={organizationId}
                id={`organization-user-search-${organizationId}`}
                scope="global"
                value={selectedUser?.id}
                onChange={(user) => {
                  onSelectedUserChange(user);
                }}
                selectedUserDisplay={selectedUser}
                excludeUserIds={members.map((member) => member.id)}
                disabled={isPending}
              />

              {selectedUser ? (
                <p className="text-sm text-muted-foreground">
                  Invite will be sent to {selectedUser.email}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Search for a registered user to invite them by their account
                  email.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !selectedUser}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Send invite
            </Button>
          </form>
        ) : (
          <p className="text-xs text-muted-foreground">
            Switch to this organization first to send invites for it.
          </p>
        )
      ) : (
        <p className="text-xs text-muted-foreground">
          Only owners and admins can send invites.
        </p>
      )}
    </div>
  );
}

'use client';

import type { OrganizationMemberView } from '@repo/types';
import { Badge } from '@web/components/ui/badge';

import { getRoleBadgeVariant } from '@web/components/organizations/organization-role-display';

type OrganizationDetailMembersSectionProps = {
  members: OrganizationMemberView[];
};

export function OrganizationDetailMembersSection({
  members,
}: OrganizationDetailMembersSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Members</h3>
        <Badge variant="outline">{members.length}</Badge>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-4 rounded-lg border p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {member.email}
              </p>
            </div>

            <Badge variant={getRoleBadgeVariant(member.role)}>
              {member.role}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

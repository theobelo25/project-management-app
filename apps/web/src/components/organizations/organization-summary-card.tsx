'use client';

import { Building2, UserPlus } from 'lucide-react';

import type { OrganizationView } from '@repo/types';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Badge } from '@web/components/ui/badge';
import {
  formatJoinedAt,
  getRoleBadgeVariant,
  getRoleIcon,
} from '@web/components/organizations/organization-role-display';

type OrganizationSummaryCardProps = {
  organization: OrganizationView;
  isCurrent: boolean;
  isSwitching: boolean;
  onSwitch: (organizationId: string) => void;
  onOpenDetails: (organizationId: string) => void;
};

export function OrganizationSummaryCard({
  organization,
  isCurrent,
  isSwitching,
  onSwitch,
  onOpenDetails,
}: OrganizationSummaryCardProps) {
  const canAddMembers =
    organization.role === 'OWNER' || organization.role === 'ADMIN';

  return (
    <Card className={isCurrent ? 'border-primary/40' : undefined}>
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span>{organization.name}</span>
            </CardTitle>
            <CardDescription>
              Joined {formatJoinedAt(organization.joinedAt)}
            </CardDescription>
          </div>

          <Badge
            variant={getRoleBadgeVariant(organization.role)}
            className="inline-flex items-center gap-1"
          >
            {getRoleIcon(organization.role)}
            {organization.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">
              {isCurrent ? 'Active organization' : 'Inactive organization'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isCurrent
                ? 'This is your current workspace.'
                : 'Switch to make this your current workspace.'}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => onSwitch(organization.id)}
            disabled={isCurrent || isSwitching}
          >
            {isCurrent ? 'Current' : isSwitching ? 'Switching...' : 'Switch'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenDetails(organization.id)}
          >
            View details
          </Button>

          {canAddMembers ? (
            <Button
              type="button"
              onClick={() => onOpenDetails(organization.id)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add member
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Building2 } from 'lucide-react';

import type { OrganizationView } from '@repo/types';
import { Card, CardContent } from '@web/components/ui/card';
import { OrganizationSummaryCard } from '@web/components/organizations/organization-summary-card';

type OrganizationsListProps = {
  isLoading: boolean;
  isError: boolean;
  organizations: OrganizationView[];
  activeOrganizationId: string | null;
  switchingToOrganizationId: string | null;
  onSwitch: (organizationId: string) => void;
  onOpenOrganization: (organizationId: string) => void;
};

export function OrganizationsList({
  isLoading,
  isError,
  organizations,
  activeOrganizationId,
  switchingToOrganizationId,
  onSwitch,
  onOpenOrganization,
}: OrganizationsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Loading organizations</h2>
            <p className="text-sm text-muted-foreground">
              Fetching your organization list...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-lg font-medium">
              Unable to load organizations
            </h2>
            <p className="text-sm text-muted-foreground">
              Try refreshing the page or signing in again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-lg font-medium">No organizations found</h2>
            <p className="text-sm text-muted-foreground">
              Try a different search or create a new organization.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {organizations.map((organization) => {
        const isCurrent = activeOrganizationId === organization.id;
        const isSwitching = switchingToOrganizationId === organization.id;

        return (
          <OrganizationSummaryCard
            key={organization.id}
            organization={organization}
            isCurrent={isCurrent}
            isSwitching={isSwitching}
            onSwitch={onSwitch}
            onOpenDetails={onOpenOrganization}
          />
        );
      })}
    </div>
  );
}

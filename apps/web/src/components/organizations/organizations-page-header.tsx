'use client';

import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';
import { PageHeader } from '@web/components/projects';
import { CreateOrganizationDialog } from '@web/components/organizations/create-organization-dialog';
import { ROUTES } from '@web/lib/routes';

type OrganizationsPageHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function OrganizationsPageHeader({
  search,
  onSearchChange,
}: OrganizationsPageHeaderProps) {
  return (
    <PageHeader
      backHref={ROUTES.dashboard}
      backLabel="Back to Dashboard"
      title="Organizations"
      description="Manage the organizations you belong to and add existing users to them."
      actions={
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-[420px]">
          <Label htmlFor="organization-search" className="sr-only">
            Search organizations
          </Label>
          <Input
            id="organization-search"
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <CreateOrganizationDialog />
        </div>
      }
    />
  );
}

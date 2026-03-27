'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { OrganizationDetailDialog } from '@web/components/organizations/organization-detail-dialog';
import { OrganizationsList } from '@web/components/organizations/organizations-list';
import { OrganizationsPageHeader } from '@web/components/organizations/organizations-page-header';
import {
  useMeQuery,
  useOrganizationsQuery,
  useSwitchOrganizationMutation,
} from '@web/lib/api/queries';
import { ROUTES } from '@web/lib/routes';

export default function OrganizationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const { data: me, isPending: isMePending } = useMeQuery();
  const organizationsQuery = useOrganizationsQuery(!!me);
  const switchOrganizationMutation = useSwitchOrganizationMutation();

  const activeOrganizationId = me?.orgId ?? null;

  const filteredOrganizations = useMemo(() => {
    const organizations = organizationsQuery.data ?? [];
    const q = search.trim().toLowerCase();

    if (!q) return organizations;

    return organizations.filter((organization) => {
      return (
        organization.name.toLowerCase().includes(q) ||
        organization.role.toLowerCase().includes(q)
      );
    });
  }, [organizationsQuery.data, search]);

  async function handleSwitch(organizationId: string) {
    try {
      await switchOrganizationMutation.mutateAsync(organizationId);
      toast.success('Organization switched');
      router.push(ROUTES.dashboard);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to switch organization',
      );
    }
  }

  const isLoading = isMePending || organizationsQuery.isPending;
  const isError = organizationsQuery.isError;

  const switchingToOrganizationId =
    switchOrganizationMutation.isPending &&
    switchOrganizationMutation.variables != null
      ? switchOrganizationMutation.variables
      : null;

  return (
    <>
      <div className="pt-6">
        <OrganizationsPageHeader search={search} onSearchChange={setSearch} />
      </div>

      <div className="space-y-6">
        <OrganizationsList
          isLoading={isLoading}
          isError={isError}
          organizations={filteredOrganizations}
          activeOrganizationId={activeOrganizationId}
          switchingToOrganizationId={switchingToOrganizationId}
          onSwitch={handleSwitch}
          onOpenOrganization={setSelectedOrgId}
        />
      </div>

      <OrganizationDetailDialog
        organizationId={selectedOrgId}
        open={!!selectedOrgId}
        onOpenChange={(open) => {
          if (!open) setSelectedOrgId(null);
        }}
        activeOrganizationId={activeOrganizationId}
      />
    </>
  );
}

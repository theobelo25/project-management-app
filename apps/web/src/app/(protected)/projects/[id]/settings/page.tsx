'use client';
import { useParams } from 'next/navigation';
import { useProjectMembersQuery, useProjectQuery } from '@web/lib/api/queries';

import {
  GeneralSettingsCard,
  MemberSettingsCard,
  DangerZoneCard,
  PermissionsSummaryCard,
} from '@web/components/projects/settings';
import { mapMembersWithRole } from '@web/components/projects/utils/map-member-with-role';
import { PageLoader } from '@web/components/layout/page-loader';
import { PageError } from '@web/components/layout/page-error';

export default function ProjectSettingsPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : null;
  const { data: project, isLoading, isError, error } = useProjectQuery(id);
  const { data: membersData } = useProjectMembersQuery(id);
  const membersWithRole = mapMembersWithRole({
    projectMembers: project?.members,
    membersItems: membersData?.items,
  });

  const canManageMembers =
    project?.currentUserRole === 'OWNER' ||
    project?.currentUserRole === 'ADMIN';

  const canDeleteProject = project?.currentUserRole === 'OWNER';

  if (!id) return null;
  if (isLoading) {
    return <PageLoader />;
  }
  if (isError || !project) {
    return <PageError message={error?.message ?? 'Project not found'} />;
  }
  if (!project.currentUserRole) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold">
          You do not have permission to edit settings on this project
        </p>
        <p className="text-sm text-muted-foreground">
          Please contact project admin for assisstance
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 mb-4">
        <GeneralSettingsCard project={project} />
        <MemberSettingsCard
          project={project}
          canManageMembers={canManageMembers}
          membersWithRole={membersWithRole}
        />
        <DangerZoneCard project={project} canDeleteProject={canDeleteProject} />
        <PermissionsSummaryCard project={project} />
      </div>
    </>
  );
}

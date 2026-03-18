import { UserView } from '@repo/types';

type UserLike = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // legacy single-org shape
  organizationId?: string;
  organization?: { name?: string | null } | null;

  // new multi-org / active-org shape
  orgId?: string;
  activeOrganizationId?: string | null;
  activeOrganization?: { name?: string | null } | null;

  // private-user shape already includes these
  organizationName?: string;
};

export function toUserView(user: UserLike): UserView {
  const orgId =
    user.orgId ?? user.activeOrganizationId ?? user.organizationId ?? '';

  const organizationName =
    user.organizationName ??
    user.activeOrganization?.name ??
    user.organization?.name ??
    '(unknown organization)';

  return {
    id: user.id,
    orgId,
    organizationName,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

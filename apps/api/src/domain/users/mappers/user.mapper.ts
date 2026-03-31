import { PrivateUser, UserView } from '@repo/types';

type UserLike = {
  id: string;
  email: string;
  name: string;
  themeMode?: 'LIGHT' | 'DARK' | 'SYSTEM' | 'light' | 'dark' | 'system' | null;
  colorScheme?:
    | 'DEFAULT'
    | 'PASTEL_WARM'
    | 'PASTEL_COOL'
    | 'default'
    | 'pastel-warm'
    | 'pastel-cool'
    | null;
  createdAt: Date;
  updatedAt: Date;

  // legacy single-org shape
  organizationId?: string;
  organization?: { name?: string | null } | null;

  // new multi-org / active-org shape
  orgId?: string;
  activeOrganizationId?: string | null;
  activeOrganization?: { name?: string | null } | null;

  organizationName?: string;
};

const NO_ORG_LABEL = '(no active organization)';

export function toUserView(user: UserLike): UserView {
  const orgId =
    user.orgId ?? user.activeOrganizationId ?? user.organizationId ?? '';

  const organizationName =
    user.organizationName ??
    user.activeOrganization?.name ??
    user.organization?.name ??
    NO_ORG_LABEL;

  const mappedThemeMode =
    user.themeMode === 'LIGHT' || user.themeMode === 'light'
      ? 'light'
      : user.themeMode === 'DARK' || user.themeMode === 'dark'
        ? 'dark'
        : user.themeMode === 'SYSTEM' || user.themeMode === 'system'
          ? 'system'
          : undefined;

  const mappedColorScheme =
    user.colorScheme === 'DEFAULT' || user.colorScheme === 'default'
      ? 'default'
      : user.colorScheme === 'PASTEL_WARM' || user.colorScheme === 'pastel-warm'
        ? 'pastel-warm'
        : user.colorScheme === 'PASTEL_COOL' || user.colorScheme === 'pastel-cool'
          ? 'pastel-cool'
          : undefined;

  return {
    id: user.id,
    orgId,
    organizationName,
    email: user.email,
    name: user.name,
    ...(mappedThemeMode ? { themeMode: mappedThemeMode } : {}),
    ...(mappedColorScheme ? { colorScheme: mappedColorScheme } : {}),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toPrivateUser(
  user: UserLike & { passwordHash: string },
): PrivateUser {
  return {
    ...toUserView(user),
    passwordHash: user.passwordHash,
  };
}

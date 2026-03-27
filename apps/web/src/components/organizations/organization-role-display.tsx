'use client';

import { Crown, ShieldCheck, Users } from 'lucide-react';

import type { OrganizationRole } from '@repo/types';

export function getRoleBadgeVariant(role: OrganizationRole) {
  switch (role) {
    case 'OWNER':
      return 'default' as const;
    case 'ADMIN':
      return 'secondary' as const;
    case 'MEMBER':
      return 'outline' as const;
  }
}

export function getRoleIcon(role: OrganizationRole) {
  switch (role) {
    case 'OWNER':
      return <Crown className="h-4 w-4" />;
    case 'ADMIN':
      return <ShieldCheck className="h-4 w-4" />;
    case 'MEMBER':
      return <Users className="h-4 w-4" />;
  }
}

export function formatJoinedAt(joinedAt: string) {
  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(date);
}

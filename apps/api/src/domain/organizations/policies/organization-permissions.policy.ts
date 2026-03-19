import { OrganizationRole } from '@repo/types';

export function canCreateInvites(role: OrganizationRole): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canRevokeInvites(role: OrganizationRole): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canAddMembers(role: OrganizationRole): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canRemoveMembers(role: OrganizationRole): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

export function canChangeMemberRoles(role: OrganizationRole): boolean {
  // If you want only OWNER to change roles, change this to role === 'OWNER'
  return role === 'OWNER' || role === 'ADMIN';
}

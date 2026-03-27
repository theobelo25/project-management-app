import { OrganizationRole } from '@repo/types';

export const OWNER_ROLE: OrganizationRole = 'OWNER';
export const DEFAULT_MEMBER_ROLE: OrganizationRole = 'MEMBER';

export const ROLES_CAN_CREATE_INVITES: OrganizationRole[] = ['OWNER', 'ADMIN'];
export const ROLES_CAN_ADD_MEMBERS: OrganizationRole[] = ['OWNER', 'ADMIN'];

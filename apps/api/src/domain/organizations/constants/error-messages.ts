export const OrganizationErrorMessages = {
  NOT_MEMBER: 'You are not a member of this organization',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  ONLY_OWNERS_CAN_DELETE: 'Only organization owners can delete an organization',
  USER_NOT_FOUND: 'User not found',
  LAST_OWNER_CANNOT_LEAVE:
    'You cannot leave this organization because you are the last owner',
  MUST_HAVE_OTHER_ORG_TO_LEAVE:
    'You must belong to at least one other organization before leaving this one',
  CANNOT_DELETE_MEMBERS_NO_OTHER_ORG:
    'Cannot delete this organization because one or more members do not belong to another organization',
  ONLY_OWNERS_ADMINS_ADD_MEMBERS:
    'Only organization owners and admins can add members',
  USER_ALREADY_MEMBER: 'User is already a member of this organization',

  ORGANIZATION_NAME_REQUIRED: 'Organization name is required',

  // Invites
  ONLY_OWNERS_ADMINS_CAN_CREATE_INVITES:
    'Only organization owners/admins can create invites',
  INVITE_EMAIL_REQUIRED: 'Email is required',
  INVITE_TOKEN_REQUIRED: 'Invite token is required',
  INVITE_INVALID_OR_EXPIRED: 'Invalid or expired invite',
  INVITE_ALREADY_USED_OR_REVOKED: 'Invite has already been used or revoked',
  INVITE_EXPIRED: 'Invite has expired',
  INVITE_EMAIL_MISMATCH: 'This invite was sent to a different email address',
} as const;

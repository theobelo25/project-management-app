import { UserView } from '@repo/types';

export function toUserView(user: any): UserView {
  return {
    id: user.id,
    orgId: user.organizationId,
    organizationName: user.organization?.name ?? '(unknown organization)',

    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

import { PrivateUser, UserView } from '@repo/types';

export function toUserView(user: PrivateUser): UserView {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

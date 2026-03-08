import { User, UserView } from '@repo/types';

export function toUserView(user: User): UserView {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

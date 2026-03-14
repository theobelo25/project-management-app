import { Db } from '@api/prisma';
import {
  CreateUserDto,
  PrivateUser,
  UpdateUserInputDto,
  UserView,
} from '@repo/types';

export abstract class UsersRepository {
  abstract findById(id: string, tx?: Db): Promise<UserView | null>;
  abstract findByEmail(email: string, tx?: Db): Promise<UserView | null>;

  abstract findPrivateUserById(
    id: string,
    tx?: Db,
  ): Promise<PrivateUser | null>;
  abstract findPrivateUserByEmail(
    email: string,
    tx?: Db,
  ): Promise<PrivateUser | null>;

  abstract getAllUsers(tx?: Db): Promise<UserView[]>;

  abstract create(dto: CreateUserDto, tx?: Db): Promise<UserView>;

  abstract update(
    id: string,
    dto: UpdateUserInputDto,
    tx?: Db,
  ): Promise<UserView>;

  abstract searchUsers(search: string, tx?: Db): Promise<UserView[]>;
}

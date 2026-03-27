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
  abstract getUsersByOrgId(orgId: string, tx?: Db): Promise<UserView[]>;
  abstract searchUsersByOrgId(
    orgId: string,
    search: string,
    tx?: Db,
  ): Promise<UserView[]>;

  abstract create(dto: CreateUserDto, tx?: Db): Promise<UserView>;
  abstract update(
    id: string,
    dto: UpdateUserInputDto,
    tx?: Db,
  ): Promise<UserView>;
  abstract searchUsers(search: string, tx?: Db): Promise<UserView[]>;

  abstract updateOrganization(
    userId: string,
    organizationId: string,
    tx?: Db,
  ): Promise<void>;

  abstract findUserOrganizationIds(
    userId: string,
    tx?: Db,
  ): Promise<{
    id: string;
    activeOrganizationId: string;
    defaultOrganizationId: string | null;
  } | null>;

  abstract getUsersWithActiveOrganization(
    organizationId: string,
    tx?: Db,
  ): Promise<Array<{ id: string; defaultOrganizationId: string | null }>>;

  abstract updateUserOrganizationIds(
    userId: string,
    data: { activeOrganizationId: string; defaultOrganizationId?: string },
    tx?: Db,
  ): Promise<void>;

  // New: batch update wrapper to keep persistence logic in repository
  abstract updateUsersOrganizationIds(
    updates: Array<{
      userId: string;
      activeOrganizationId: string;
      defaultOrganizationId?: string;
    }>,
    tx?: Db,
  ): Promise<void>;
}

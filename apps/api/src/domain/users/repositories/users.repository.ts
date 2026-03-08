import { Db } from 'apps/api/src/prisma/types/db.type';
import {
  CreateUserDto,
  CreateUserInputDto,
  UpdateUserInputDto,
  User,
  UserView,
} from '@repo/types';

export interface UsersRepository {
  findById(id: string, db?: Db): Promise<UserView | null>;
  findByEmail(email: string, db?: Db): Promise<UserView | null>;

  findPrivateUserById(id: string, db?: Db): Promise<User | null>;
  findPrivateUserByEmail(email: string, db?: Db): Promise<User | null>;

  getAllUsers(): Promise<UserView[]>;

  create(dto: CreateUserDto, db?: Db): Promise<UserView>;

  update(id: string, dto: UpdateUserInputDto, db?: Db): Promise<UserView>;
  updateRefreshToken(
    id: string,
    refreshToken: string,
    db?: Db,
  ): Promise<UserView>;
}

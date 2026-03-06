import { Db } from 'apps/api/src/prisma/types/db.type';
import { UpdateUserInputDto, User, UserView } from '@repo/types';

export interface IUsersRepository {
  findById(id: string, db?: Db): Promise<UserView | null>;
  findByEmail(email: string, db?: Db): Promise<UserView | null>;

  findPrivateUserById(id: string, db?: Db): Promise<User | null>;
  findPrivateUserByEmail(email: string, db?: Db): Promise<User | null>;

  getAllUsers(): Promise<UserView[]>;

  create(
    data: { email: string; name?: string | null },
    db?: Db,
  ): Promise<UserView>;

  update(id: string, dto: UpdateUserInputDto, db?: Db): Promise<UserView>;
  updateRefreshToken(
    id: string,
    refreshToken: string,
    db?: Db,
  ): Promise<UserView>;
}

import { Db } from 'apps/api/src/prisma/types/db.type';
import { UserView } from '@repo/types';

export interface IUsersRepository {
  findById(id: string, db?: Db): Promise<UserView | null>;

  findByEmail(email: string, db?: Db): Promise<UserView | null>;

  create(
    data: { email: string; name?: string | null },
    db?: Db,
  ): Promise<UserView>;
}

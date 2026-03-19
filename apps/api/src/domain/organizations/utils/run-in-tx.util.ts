import { Db } from '@api/prisma';
import type { UnitOfWork } from '@api/prisma/uow/unit-of-work.interface';

export function runInTx<T>(
  uow: UnitOfWork,
  db: Db | undefined,
  run: (tx: Db) => Promise<T>,
): Promise<T> {
  if (db) return run(db);
  return uow.transaction(run);
}

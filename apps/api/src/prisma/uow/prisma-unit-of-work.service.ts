import { Inject, Injectable } from '@nestjs/common';
import { IUnitOfWork } from './unit-of-work.interface';
import { PRISMA } from '../types/prisma.constants';
import { PrismaClient } from 'packages/database/dist/src';
import { Db } from '../types/db.type';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  transaction<T>(fn: (db: Db) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => fn(tx));
  }
}

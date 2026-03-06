import { Global, Module } from '@nestjs/common';
import { PRISMA } from './types/prisma.constants';
import { prisma } from 'packages/database/dist/src';
import { UNIT_OF_WORK } from './uow/unit-of-work.interface';
import { PrismaUnitOfWork } from './uow/prisma-unit-of-work.service';

@Global()
@Module({
  providers: [
    { provide: PRISMA, useValue: prisma },
    { provide: UNIT_OF_WORK, useClass: PrismaUnitOfWork },
  ],
  exports: [PRISMA],
})
export class PrismaModule {}

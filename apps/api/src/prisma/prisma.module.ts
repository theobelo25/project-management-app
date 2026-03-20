import { Module } from '@nestjs/common';
import { PRISMA, UNIT_OF_WORK } from './types/prisma.constants';
import { prisma } from '@repo/database';
import { PrismaUnitOfWork } from './uow/prisma-unit-of-work.service';

@Module({
  providers: [
    { provide: PRISMA, useValue: prisma },
    { provide: UNIT_OF_WORK, useClass: PrismaUnitOfWork },
  ],
  exports: [PRISMA, UNIT_OF_WORK],
})
export class PrismaModule {}

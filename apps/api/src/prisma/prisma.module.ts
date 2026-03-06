import { Global, Module } from '@nestjs/common';
import { PRISMA } from './types/prisma.constants';
import { prisma } from 'packages/database/dist/src';

@Global()
@Module({
  providers: [{ provide: PRISMA, useValue: prisma }],
  exports: [PRISMA],
})
export class PrismaModule {}

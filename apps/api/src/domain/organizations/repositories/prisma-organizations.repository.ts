import { Inject, Injectable } from '@nestjs/common';
import { PRISMA, Db } from '@api/prisma';
import { PrismaClient } from '@repo/database';
import {
  OrganizationsRepository,
  CreateOrganizationData,
  OrganizationEntity,
} from './organizations.repository';

@Injectable()
export class PrismaOrganizationsRepository extends OrganizationsRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {
    super();
  }

  async create(
    data: CreateOrganizationData,
    db?: Db,
  ): Promise<OrganizationEntity> {
    const prisma = db ?? this.prisma;
    const org = await prisma.organization.create({
      data: { name: data.name.trim() },
      select: { id: true, name: true },
    });
    return org;
  }

  async delete(id: string, db?: Db): Promise<void> {
    const prisma = db ?? this.prisma;
    await prisma.organization.delete({
      where: { id },
    });
  }
}

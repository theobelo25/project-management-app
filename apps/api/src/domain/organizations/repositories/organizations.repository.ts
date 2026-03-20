import { Db } from '@api/prisma';

export type CreateOrganizationData = { name: string };

export type OrganizationEntity = { id: string; name: string };

export abstract class OrganizationsRepository {
  abstract create(
    data: CreateOrganizationData,
    db?: Db,
  ): Promise<OrganizationEntity>;

  abstract delete(id: string, db?: Db): Promise<void>;
}

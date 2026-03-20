import { Db } from '@api/prisma';
import {
  FindManyForUserInput,
  PaginatedProjectsResult,
  ProjectListMemberWithUser,
} from '../../types/projects.repository.types';

export const PROJECT_QUERY_REPOSITORY = Symbol('PROJECT_QUERY_REPOSITORY');

export interface ProjectQueryRepository {
  findManyForUser(
    input: FindManyForUserInput,
    db?: Db,
  ): Promise<PaginatedProjectsResult>;

  findMembersWithUserByProjectIds(
    projectIds: string[],
    db?: Db,
  ): Promise<Map<string, ProjectListMemberWithUser[]>>;
}

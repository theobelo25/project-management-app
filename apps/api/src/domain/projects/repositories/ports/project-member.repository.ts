import { Db } from '@api/prisma';
import { ProjectMember } from '@repo/database';
import {
  AddProjectMemberInput,
  ProjectMemberWithUser,
  UpdateProjectMemberRoleInput,
} from '../../types/projects.repository.types';

export const PROJECT_MEMBER_REPOSITORY = Symbol('PROJECT_MEMBER_REPOSITORY');

export interface ProjectMemberRepository {
  findMembership(
    projectId: string,
    userId: string,
    db?: Db,
  ): Promise<ProjectMember | null>;

  findMembersByProjectId(
    projectId: string,
    db?: Db,
  ): Promise<ProjectMemberWithUser[]>;

  addMember(
    input: AddProjectMemberInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser>;

  updateMemberRole(
    input: UpdateProjectMemberRoleInput,
    db?: Db,
  ): Promise<ProjectMemberWithUser>;

  removeMember(projectId: string, userId: string, db?: Db): Promise<void>;

  updateOwner(projectId: string, ownerId: string, db?: Db): Promise<void>;
}

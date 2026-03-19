import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectOwnershipService } from './services/project-ownership.service';
import { ProjectAccessService } from './policies/project-access.service';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';
import { ProjectsController } from './projects.controller';
import { ProjectRoleGuard } from './guards/project-role.guard';
import {
  PROJECT_AUTHORIZATION_REPOSITORY,
  PROJECT_COMMAND_REPOSITORY,
  PROJECT_MEMBER_REPOSITORY,
  PROJECT_QUERY_REPOSITORY,
  PROJECT_TASK_CONTEXT_REPOSITORY,
} from './repositories/projects.repository';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '@api/prisma';
import { ProjectsCommandsService } from './services/projects-commands.service';
import { ProjectsQueriesService } from './services/projects-queries.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsCommandsService,
    ProjectsQueriesService,
    ProjectMembersService,
    ProjectOwnershipService,
    ProjectAccessService,
    ProjectRoleGuard,
    PrismaProjectsRepository,
    {
      provide: PROJECT_AUTHORIZATION_REPOSITORY,
      useExisting: PrismaProjectsRepository,
    },
    {
      provide: PROJECT_QUERY_REPOSITORY,
      useExisting: PrismaProjectsRepository,
    },
    {
      provide: PROJECT_COMMAND_REPOSITORY,
      useExisting: PrismaProjectsRepository,
    },
    {
      provide: PROJECT_MEMBER_REPOSITORY,
      useExisting: PrismaProjectsRepository,
    },
    {
      provide: PROJECT_TASK_CONTEXT_REPOSITORY,
      useExisting: PrismaProjectsRepository,
    },
  ],
  exports: [
    ProjectsService,
    ProjectMembersService,
    ProjectOwnershipService,
    PROJECT_AUTHORIZATION_REPOSITORY,
    PROJECT_QUERY_REPOSITORY,
    PROJECT_COMMAND_REPOSITORY,
    PROJECT_MEMBER_REPOSITORY,
    PROJECT_TASK_CONTEXT_REPOSITORY,
  ],
})
export class ProjectsModule {}

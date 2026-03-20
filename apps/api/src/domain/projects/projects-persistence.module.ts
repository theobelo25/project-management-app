import { Module } from '@nestjs/common';
import { PrismaModule } from '@api/prisma';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';
import {
  PROJECT_AUTHORIZATION_REPOSITORY,
  PROJECT_COMMAND_REPOSITORY,
  PROJECT_MEMBER_REPOSITORY,
  PROJECT_QUERY_REPOSITORY,
  PROJECT_TASK_CONTEXT_REPOSITORY,
} from './repositories/projects.repository';

/**
 * Project persistence + repository port tokens only (no HTTP, no Tasks).
 * Imported by `ProjectsModule` and by `TasksModule` for `PROJECT_TASK_CONTEXT_REPOSITORY`,
 * which breaks the former ProjectsModule ↔ TasksModule `forwardRef` cycle.
 */
@Module({
  imports: [PrismaModule],
  providers: [
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
    PROJECT_AUTHORIZATION_REPOSITORY,
    PROJECT_QUERY_REPOSITORY,
    PROJECT_COMMAND_REPOSITORY,
    PROJECT_MEMBER_REPOSITORY,
    PROJECT_TASK_CONTEXT_REPOSITORY,
  ],
})
export class ProjectsPersistenceModule {}

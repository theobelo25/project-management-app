import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './members/project-members.service';
import { ProjectOwnershipService } from './members/project-ownership.service';
import { ProjectAccessService } from './access/project-access.service';
import { PROJECTS_REPOSITORY } from './types/projects.tokens';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';

@Module({
  providers: [
    ProjectsService,
    ProjectMembersService,
    ProjectOwnershipService,
    ProjectAccessService,
    {
      provide: PROJECTS_REPOSITORY,
      useClass: PrismaProjectsRepository,
    },
  ],
  exports: [ProjectsService, ProjectMembersService, ProjectOwnershipService],
})
export class ProjectsModule {}

import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './members/project-members.service';
import { ProjectOwnershipService } from './members/project-ownership.service';
import { ProjectAccessService } from './access/project-access.service';
import { PROJECTS_REPOSITORY } from './types/projects.tokens';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';
import { ProjectsController } from './projects.controller';
import { ProjectRoleGuard } from './guards/project-role.guard';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectMembersService,
    ProjectOwnershipService,
    ProjectAccessService,
    ProjectRoleGuard,
    {
      provide: PROJECTS_REPOSITORY,
      useClass: PrismaProjectsRepository,
    },
  ],
  exports: [ProjectsService, ProjectMembersService, ProjectOwnershipService],
})
export class ProjectsModule {}

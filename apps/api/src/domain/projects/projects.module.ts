import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './members/project-members.service';
import { ProjectOwnershipService } from './members/project-ownership.service';
import { ProjectAccessService } from './policies/project-access.service';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';
import { ProjectsController } from './projects.controller';
import { ProjectRoleGuard } from './guards/project-role.guard';
import { ProjectsRepository } from './repositories/projects.repository';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectMembersService,
    ProjectOwnershipService,
    ProjectAccessService,
    ProjectRoleGuard,
    {
      provide: ProjectsRepository,
      useClass: PrismaProjectsRepository,
    },
  ],
  exports: [
    ProjectsService,
    ProjectMembersService,
    ProjectOwnershipService,
    ProjectsRepository,
  ],
})
export class ProjectsModule {}

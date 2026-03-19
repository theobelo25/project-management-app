import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectOwnershipService } from './services/project-ownership.service';
import { ProjectAccessService } from './policies/project-access.service';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';
import { ProjectsController } from './projects.controller';
import { ProjectRoleGuard } from './guards/project-role.guard';
import { ProjectsRepository } from './repositories/projects.repository';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '@api/prisma';
import { ProjectsCommandsService } from './services/projects-commands.service';
import { ProjectsQueriesService } from './services/projects-queries.service';

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

import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './members/project-members.service';
import { ProjectOwnershipService } from './members/project-ownership.service';
import { ProjectAccessService } from './policies/project-access.service';
import { PrismaProjectsRepository } from './repositories/prisma-projects.repository';
import { ProjectsController } from './projects.controller';
import { ProjectRoleGuard } from './guards/project-role.guard';
import { ProjectsRepository } from './repositories/projects.repository';
import { TasksRepository } from '../tasks/repositories/tasks.repository';
import { PrismaTasksRepository } from '../tasks/repositories/prisma-tasks.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
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
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
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

import { Module } from '@nestjs/common';
import { PrismaModule } from '@api/prisma';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectOwnershipService } from './services/project-ownership.service';
import { ProjectAccessService } from './policies/project-access.service';
import { ProjectsController } from './projects.controller';
import { ProjectRoleGuard } from './guards/project-role.guard';
import { UsersModule } from '../users/users.module';
import { ProjectsCommandsService } from './services/projects-commands.service';
import { ProjectsQueriesService } from './services/projects-queries.service';
import { TasksModule } from '../tasks/tasks.module';
import { ProjectsFacade } from './projects.facade';
import { ProjectsPersistenceModule } from './projects-persistence.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProjectsPersistenceModule,
    TasksModule,
    NotificationsModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsCommandsService,
    ProjectsQueriesService,
    ProjectMembersService,
    ProjectOwnershipService,
    ProjectAccessService,
    ProjectRoleGuard,
    ProjectsFacade,
  ],
  exports: [
    ProjectsPersistenceModule,
    ProjectsService,
    ProjectMembersService,
    ProjectOwnershipService,
  ],
})
export class ProjectsModule {}

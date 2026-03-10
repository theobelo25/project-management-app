import { PrismaModule } from '@api/prisma';
import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PROJECTS_REPOSITORY } from './types/projects.tokens';
import { PrismaAuthRepository } from '../auth/repositories/prisma-auth.repository';
import { ProjectAccessService } from './access/project-access.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectAccessService,
    { provide: PROJECTS_REPOSITORY, useClass: PrismaAuthRepository },
  ],
  exports: [ProjectsService, ProjectAccessService],
})
export class ProjectsModel {}

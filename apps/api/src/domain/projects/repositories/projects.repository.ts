import type { ProjectAuthorizationRepository } from './ports/project-authorization.repository';
import type { ProjectCommandRepository } from './ports/project-command.repository';
import type { ProjectMemberRepository } from './ports/project-member.repository';
import type { ProjectQueryRepository } from './ports/project-query.repository';
import type { ProjectTaskContextRepository } from './ports/project-task-context.repository';
export * from './ports';

export type ProjectsRepository = ProjectAuthorizationRepository &
  ProjectQueryRepository &
  ProjectCommandRepository &
  ProjectMemberRepository &
  ProjectTaskContextRepository;

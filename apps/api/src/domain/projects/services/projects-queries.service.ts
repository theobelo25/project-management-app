import { Inject, Injectable } from '@nestjs/common';
import {
  IProjectTaskInfoProvider,
  PROJECT_TASK_INFO_PROVIDER,
} from '../types/project-task-info.types';
import {
  AuthUser,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  ProjectDetailView,
  ProjectView,
} from '@repo/types';
import {
  PROJECT_QUERY_REPOSITORY,
  type ProjectQueryRepository,
} from '../repositories/projects.repository';
import { ProjectAccessService } from '../policies/project-access.service';
import {
  toPaginatedProjectListView,
  toProjectDetailView,
  toProjectView,
} from '../mappers/project.mapper';
import { ProjectWithRole } from '../types/projects.repository.types';

@Injectable()
export class ProjectsQueriesService {
  constructor(
    @Inject(PROJECT_QUERY_REPOSITORY)
    private readonly projects: ProjectQueryRepository,
    @Inject(PROJECT_TASK_INFO_PROVIDER)
    private readonly projectTaskInfo: IProjectTaskInfoProvider,
    private readonly projectAccessService: ProjectAccessService,
  ) {}

  async findManyForUser(
    user: AuthUser,
    query: GetProjectsQueryDto,
  ): Promise<PaginatedProjectsListView> {
    const result = await this.projects.findManyForUser({
      orgId: user.orgId,
      userId: user.id,
      page: query.page,
      pageSize: query.pageSize,
      includeArchived: query.includeArchived,
      search: query.search,
      filter: query.filter,
      sort: query.sort,
    });

    const projectIds = result.items.map((p) => p.id);

    const [taskCountsMap, membersMap] = await Promise.all([
      this.projectTaskInfo.getTaskCountsByProjectIds(projectIds, user.orgId),
      this.projects.findMembersWithUserByProjectIds(projectIds),
    ]);

    return toPaginatedProjectListView(result, taskCountsMap, membersMap);
  }

  async findById(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectView> {
    const project =
      authorizedProject ??
      (await this.projectAccessService.requireMember(projectId, user));

    return toProjectView(project);
  }

  async findDetailById(
    projectId: string,
    user: AuthUser,
    authorizedProject?: ProjectWithRole,
  ): Promise<ProjectDetailView> {
    const project =
      authorizedProject ??
      (await this.projectAccessService.requireMember(projectId, user));

    const [countsMap, members, recentTasks] = await Promise.all([
      this.projectTaskInfo.getTaskCountsByProjectIds([projectId], user.orgId),
      this.projects.findMembersWithUserByProjectIds([projectId]),
      this.projectTaskInfo.findRecentByProjectId(projectId, 10, user.orgId),
    ]);

    const counts = countsMap.get(projectId) ?? { total: 0, completed: 0 };
    const membersList = members.get(projectId) ?? [];

    return toProjectDetailView(project, counts, membersList, recentTasks);
  }
}

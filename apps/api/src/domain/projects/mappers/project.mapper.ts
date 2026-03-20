import {
  PaginatedProjectsListView,
  ProjectListItemView,
  ProjectView,
  ProjectDetailView,
  ProjectRecentTask,
} from '@repo/types';
import {
  ProjectWithRole,
  PaginatedProjectsResult,
  ProjectListMemberWithUser,
} from '../types/projects.repository.types';
import {
  toIsoString,
  toIsoStringOrNull,
} from '@api/common/mappers/mapper.utils';

export function toProjectView(project: ProjectWithRole): ProjectView {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? null,
    ownerId: project.ownerId,
    archivedAt: toIsoStringOrNull(project.archivedAt),
    createdAt: toIsoString(project.createdAt),
    updatedAt: toIsoString(project.updatedAt),
    currentUserRole: project.currentUserRole,
  };
}

export function toProjectListItemView(
  project: ProjectWithRole,
  counts: { total: number; completed: number },
  members: ProjectListMemberWithUser[],
): ProjectListItemView {
  const base = toProjectView(project);
  const openTasks = counts.total - counts.completed;
  return {
    ...base,
    totalTasks: counts.total,
    completedTasks: counts.completed,
    openTasks,
    members: members.map((m) => ({
      id: m.userId,
      name: m.name,
      image: m.image ?? null,
    })),
  };
}

export function toPaginatedProjectListView(
  result: PaginatedProjectsResult,
  taskCountsMap: Map<string, { total: number; completed: number }>,
  membersMap: Map<string, ProjectListMemberWithUser[]>,
): PaginatedProjectsListView {
  return {
    items: result.items.map((project) =>
      toProjectListItemView(
        project,
        taskCountsMap.get(project.id) ?? { total: 0, completed: 0 },
        membersMap.get(project.id) ?? [],
      ),
    ),
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    totalPages: Math.ceil(result.total / result.pageSize),
  };
}

export function toProjectDetailView(
  project: ProjectWithRole,
  counts: { total: number; completed: number },
  members: ProjectListMemberWithUser[],
  recentTasks: ProjectRecentTask[],
): ProjectDetailView {
  const base = toProjectView(project);
  const openTasks = counts.total - counts.completed;
  return {
    ...base,
    totalTasks: counts.total,
    completedTasks: counts.completed,
    openTasks,
    members: members.map((m) => ({
      id: m.userId,
      name: m.name,
      email: m.email ?? undefined,
      image: m.image ?? null,
    })),
    recentTasks: recentTasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    })),
  };
}

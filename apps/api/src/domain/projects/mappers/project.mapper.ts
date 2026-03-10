import { PaginatedProjectsView, ProjectView } from '@repo/types';
import {
  ProjectWithRole,
  PaginatedProjectsResult,
} from '../types/projects.repository.types';

export function toProjectView(project: ProjectWithRole): ProjectView {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? null,
    ownerId: project.ownerId,
    archivedAt: project.archivedAt?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    currentUserRole: project.currentUserRole,
  };
}

export function toPaginatedProjectsView(
  result: PaginatedProjectsResult,
): PaginatedProjectsView {
  return {
    items: result.items.map(toProjectView),
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    totalPages: Math.ceil(result.total / result.pageSize),
  };
}

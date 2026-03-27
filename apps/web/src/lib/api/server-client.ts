import { cookies } from 'next/headers';
import {
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  FindTasksQuery,
  PaginationResult,
  TaskView,
  COOKIE,
  ProjectDetailView,
  ProjectMembersView,
} from '@repo/types';

import { getPublicApiBaseUrl } from './public-api-url';

const API_BASE = getPublicApiBaseUrl();

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const auth = cookieStore.get(COOKIE.AUTHENTICATION);
  const refresh = cookieStore.get(COOKIE.REFRESH);
  const parts: string[] = [];
  if (auth) parts.push(`${auth.name}=${auth.value}`);
  if (refresh) parts.push(`${refresh.name}=${refresh.value}`);
  return parts.join('; ');
}

export async function fetchProjectsServer(
  query: GetProjectsQueryDto,
): Promise<PaginatedProjectsListView> {
  const params = new URLSearchParams();

  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));
  if (query.includeArchived !== undefined)
    params.set('includeArchived', String(query.includeArchived));
  if (query.search) params.set('search', query.search);
  if (query.filter) params.set('filter', query.filter);
  if (query.sort) params.set('sort', query.sort);

  const res = await fetch(`${API_BASE}/api/projects?${params.toString()}`, {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch projects');

  return res.json();
}

export async function fetchProjectServer(
  id: string,
): Promise<ProjectDetailView> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Project not found');
    throw new Error('Failed to fetch project');
  }
  return res.json();
}

export async function fetchTasksServer(
  query: FindTasksQuery,
): Promise<PaginationResult<TaskView>> {
  const params = new URLSearchParams();

  params.set('projectId', query.projectId);
  params.set('page', String(query.page ?? 1));
  params.set('limit', String(query.limit ?? 20));
  if (query.status) params.set('status', query.status);
  if (query.assigneeId) params.set('assigneeId', query.assigneeId);
  if (query.search?.trim()) params.set('search', query.search.trim());

  const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`, {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch tasks');

  return res.json();
}

export async function fetchProjectMembersServer(
  projectId: string,
): Promise<ProjectMembersView> {
  const res = await fetch(`${API_BASE}/api/projects/${projectId}/members`, {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Project not found');
    throw new Error('Failed to fetch project members');
  }
  return res.json();
}

export async function fetchTaskServer(taskId: string): Promise<TaskView> {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Task not found');
    throw new Error('Failed to fetch task');
  }
  return res.json();
}

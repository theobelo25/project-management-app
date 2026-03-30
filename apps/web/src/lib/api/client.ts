import {
  SignupRequestDto,
  LoginRequestDto,
  UserView,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  CreateProjectDto,
  ProjectView,
  TaskView,
  CreateTaskDto,
  FindTasksQuery,
  PaginationResult,
  ProjectDetailView,
  UpdateProjectDto,
  ProjectMembersView,
  AddProjectMemberDto,
  ProjectMemberView,
  UpdateProjectMemberRoleDto,
  UpdateTaskInput,
  TaskAssignmentView,
  PendingInviteView,
  NotificationView,
  OrganizationView,
  CreateOrganizationDto,
  CreateOrganizationInviteDto,
  OrganizationDetailView,
  OrganizationInviteView,
  AddOrganizationMemberDto,
  OrganizationMemberView,
} from '@repo/types';

import { getPublicApiBaseUrl } from './public-api-url';

const API_BASE = getPublicApiBaseUrl();

function errorMessageFromJsonBody(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) return undefined;
  if (!('message' in body)) return undefined;
  const m = (body as { message: unknown }).message;
  return typeof m === 'string' ? m : undefined;
}

async function readJsonBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  return JSON.parse(text) as T;
}

type SessionExpiredHandler = () => void;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler) {
  sessionExpiredHandler = handler;
}

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function isRefreshUrl(url: string): boolean {
  return url.includes('/auth/refresh');
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof Request
        ? input.url
        : String(input);

  let res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (res.status === 401 && !isRefreshUrl(url)) {
    const refreshed = await doRefresh();
    if (refreshed) {
      res = await fetch(input, {
        ...init,
        credentials: 'include',
      });
    } else {
      sessionExpiredHandler?.();
      throw new Error('Session expired');
    }
  }

  return res;
}

// PUBLIC ROUTES
export async function signup(dto: SignupRequestDto): Promise<UserView | null> {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to sign up');
  }

  return parseJsonResponse<UserView | null>(res);
}

export async function signin(dto: LoginRequestDto): Promise<UserView | null> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to sign in');
  }

  return parseJsonResponse<UserView | null>(res);
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to sign out');
  }

  return;
}

// PROTECTED ROUTES
export async function fetchMe(): Promise<UserView | null> {
  const res = await fetchWithAuth(`${API_BASE}/api/auth/me`, {
    credentials: 'include',
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');

  return parseJsonResponse<UserView>(res);
}

export async function updateMe(dto: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): Promise<UserView> {
  const res = await fetchWithAuth(`${API_BASE}/api/auth/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to update profile',
    );
  }

  return parseJsonResponse<UserView>(res);
}

/** Invites (for org switching) */
export async function fetchPendingInvites(): Promise<PendingInviteView[]> {
  const res = await fetchWithAuth(`${API_BASE}/api/organizations/invites`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch invites');
  return parseJsonResponse<PendingInviteView[]>(res);
}

export async function acceptInviteById(inviteId: string): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/invites/${inviteId}/accept`,
    { method: 'POST', credentials: 'include' },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to accept invite',
    );
  }
}

export async function declineInviteById(inviteId: string): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/invites/${inviteId}/decline`,
    { method: 'POST', credentials: 'include' },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to decline invite',
    );
  }
}

/** Notifications (task assigned, etc.) */
export async function fetchNotifications(): Promise<NotificationView[]> {
  const res = await fetchWithAuth(`${API_BASE}/api/notifications`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return parseJsonResponse<NotificationView[]>(res);
}

export async function clearNotification(notificationId: string): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/notifications/${notificationId}/clear`,
    { method: 'POST', credentials: 'include' },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to clear notification',
    );
  }
  return;
}

export async function fetchProjects(
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

  const res = await fetchWithAuth(
    `${API_BASE}/api/projects?${params.toString()}`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('Failed to fetch projects');
  return parseJsonResponse<PaginatedProjectsListView>(res);
}

export async function createProject(
  dto: CreateProjectDto,
): Promise<ProjectView> {
  const res = await fetchWithAuth(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to create project',
    );
  }
  return parseJsonResponse<ProjectView>(res);
}

export async function fetchProject(id: string): Promise<ProjectDetailView> {
  const res = await fetchWithAuth(`${API_BASE}/api/projects/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Project not found');
    throw new Error('Failed to fetch project');
  }
  return parseJsonResponse<ProjectDetailView>(res);
}

export async function createTask(
  projectId: string,
  dto: CreateTaskDto,
): Promise<TaskView> {
  const res = await fetchWithAuth(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...dto, projectId }),
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to create task');
  }
  return parseJsonResponse<TaskView>(res);
}

export async function fetchTasks(
  query: FindTasksQuery,
): Promise<PaginationResult<TaskView>> {
  const params = new URLSearchParams();
  params.set('projectId', query.projectId);
  params.set('page', String(query.page ?? 1));
  params.set('limit', String(query.limit ?? 20));
  if (query.status) params.set('status', query.status);
  if (query.priority) params.set('priority', query.priority);
  if (query.labelColor) params.set('labelColor', query.labelColor);
  if (query.assigneeId) params.set('assigneeId', query.assigneeId);
  if (query.search?.trim()) params.set('search', query.search.trim());

  const res = await fetchWithAuth(
    `${API_BASE}/api/tasks?${params.toString()}`,
    { credentials: 'include' },
  );

  if (!res.ok) throw new Error('Failed to fetch tasks');
  return parseJsonResponse<PaginationResult<TaskView>>(res);
}

export async function fetchTask(taskId: string): Promise<TaskView> {
  const res = await fetchWithAuth(`${API_BASE}/api/tasks/${taskId}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Task not found');
    throw new Error('Failed to fetch task.');
  }
  return parseJsonResponse<TaskView>(res);
}

export async function updateProject(
  id: string,
  dto: UpdateProjectDto,
): Promise<ProjectView> {
  const res = await fetchWithAuth(`${API_BASE}/api/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to update project',
    );
  }
  return parseJsonResponse<ProjectView>(res);
}

export async function archiveProject(id: string): Promise<ProjectView> {
  const res = await fetchWithAuth(`${API_BASE}/api/projects/${id}/archive`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to archive project',
    );
  }
  return parseJsonResponse<ProjectView>(res);
}

export async function unarchiveProject(id: string): Promise<ProjectView> {
  const res = await fetchWithAuth(`${API_BASE}/api/projects/${id}/unarchive`, {
    method: 'PATCH',
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to unarchive project',
    );
  }
  return parseJsonResponse<ProjectView>(res);
}

export async function fetchProjectMembers(
  projectId: string,
): Promise<ProjectMembersView> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/projects/${projectId}/members`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('Failed to fetch project members');
  return parseJsonResponse<ProjectMembersView>(res);
}

export async function addProjectMember(
  projectId: string,
  dto: AddProjectMemberDto,
): Promise<ProjectMemberView> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/projects/${projectId}/members`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to add member');
  }
  return parseJsonResponse<ProjectMemberView>(res);
}

export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  dto: UpdateProjectMemberRoleDto,
): Promise<ProjectMemberView> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/projects/${projectId}/members/${userId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to update role');
  }
  return parseJsonResponse<ProjectMemberView>(res);
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/projects/${projectId}/members/${userId}`,
    { method: 'DELETE', credentials: 'include' },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to remove member',
    );
  }
}

export async function fetchUsers(search?: string): Promise<UserView[]> {
  const url = search?.trim()
    ? `${API_BASE}/api/users?search=${encodeURIComponent(search.trim())}`
    : `${API_BASE}/api/users`;
  const res = await fetchWithAuth(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return parseJsonResponse<UserView[]>(res);
}

export async function deleteTask(taskId: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/api/tasks/${taskId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to delete task');
  }
}

export async function updateTask(
  projectId: string,
  taskId: string,
  payload: UpdateTaskInput,
): Promise<TaskView> {
  const response = await fetchWithAuth(`${API_BASE}/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to update task');
  }

  return parseJsonResponse<TaskView>(response);
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/api/projects/${projectId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to delete project',
    );
  }
}

export async function assignTaskUser(
  taskId: string,
  userId: string,
): Promise<TaskAssignmentView> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/tasks/${taskId}/assignees/${userId}`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to assign user to task',
    );
  }
  return parseJsonResponse<TaskAssignmentView>(res);
}

export async function unassignTaskUser(
  taskId: string,
  userId: string,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/tasks/${taskId}/assignees/${userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to unassign user from task',
    );
  }
}

export async function fetchOrganizations(): Promise<OrganizationView[]> {
  const res = await fetchWithAuth(`${API_BASE}/api/organizations`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch organizations');
  return parseJsonResponse<OrganizationView[]>(res);
}

export async function createOrganization(
  dto: CreateOrganizationDto,
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/api/organizations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to create organization',
    );
  }
}

export async function switchOrganization(
  organizationId: string,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/${organizationId}/switch`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to switch organization',
    );
  }
}

export async function fetchOrganization(
  organizationId: string,
): Promise<OrganizationDetailView> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/${organizationId}`,
    {
      credentials: 'include',
    },
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error('Organization not found');
    throw new Error('Failed to fetch organization');
  }
  return parseJsonResponse<OrganizationDetailView>(res);
}
export async function createOrganizationInvite(
  dto: CreateOrganizationInviteDto,
): Promise<OrganizationInviteView> {
  const res = await fetchWithAuth(`${API_BASE}/api/organizations/invites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to create invite',
    );
  }
  return parseJsonResponse<OrganizationInviteView>(res);
}
export async function leaveOrganization(organizationId: string): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/${organizationId}/leave`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to leave organization',
    );
  }
}
export async function deleteOrganization(
  organizationId: string,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/${organizationId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(
      errorMessageFromJsonBody(body) ?? 'Failed to delete organization',
    );
  }
}

export async function fetchAllUsers(search?: string): Promise<UserView[]> {
  const url = search?.trim()
    ? `${API_BASE}/api/users/search?search=${encodeURIComponent(search.trim())}`
    : `${API_BASE}/api/users/search`;
  const res = await fetchWithAuth(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return parseJsonResponse<UserView[]>(res);
}
export async function addOrganizationMember(
  organizationId: string,
  dto: AddOrganizationMemberDto,
): Promise<OrganizationMemberView> {
  const res = await fetchWithAuth(
    `${API_BASE}/api/organizations/${organizationId}/members`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
      credentials: 'include',
    },
  );
  if (!res.ok) {
    const body = await readJsonBody(res);
    throw new Error(errorMessageFromJsonBody(body) ?? 'Failed to add member');
  }
  return parseJsonResponse<OrganizationMemberView>(res);
}

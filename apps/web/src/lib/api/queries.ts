import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInviteById,
  declineInviteById,
  fetchMe,
  fetchPendingInvites,
  fetchProject,
  fetchProjectMembers,
  fetchProjects,
  fetchTask,
  fetchTasks,
  fetchUsers,
} from "./client";
import {
  FindTasksQuery,
  GetProjectsQueryDto,
  PaginatedProjectsListView,
  PaginationResult,
  PendingInviteView,
  ProjectDetailView,
  ProjectMembersView,
  TaskView,
} from "@repo/types";

export const ME_QUERY_KEY = ["me"] as const;

export function useMeQuery() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export const PENDING_INVITES_QUERY_KEY = ["organizations", "invites"] as const;

export function usePendingInvitesQuery(enabled: boolean) {
  return useQuery<PendingInviteView[]>({
    queryKey: PENDING_INVITES_QUERY_KEY,
    queryFn: fetchPendingInvites,
    enabled,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAcceptInviteByIdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => acceptInviteById(inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PENDING_INVITES_QUERY_KEY,
      });
      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
    },
  });
}

export function useDeclineInviteByIdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => declineInviteById(inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: PENDING_INVITES_QUERY_KEY,
      });
    },
  });
}

export const PROJECTS_QUERY_KEY = ["projects"] as const;

export function useProjectsQuery(
  query: GetProjectsQueryDto,
  options?: {
    initialData?: PaginatedProjectsListView;
    initialDataUpdatedAt?: number;
  },
) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, query],
    queryFn: () => fetchProjects(query),
    staleTime: 30 * 1000,
    initialData: options?.initialData,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
  });
}

export const PROJECT_QUERY_KEY = (id: string) => ["projects", id] as const;
export const PROJECT_TASKS_QUERY_KEY = (projectId: string) =>
  ["projects", projectId, "tasks"] as const;

export function useProjectQuery(
  projectId: string | null,
  options?: {
    initialData?: ProjectDetailView | null;
    initialDataUpdatedAt?: number;
  },
) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
    initialData: options?.initialData ?? undefined,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
  });
}

export const TASK_QUERY_KEY = (taskId: string) => ["tasks", taskId] as const;

export function useProjectTasksQuery(
  projectId: string | null,
  query: Omit<FindTasksQuery, "projectId"> & { projectId?: string },
  options?: {
    initialData?: PaginationResult<TaskView>;
    initialDataUpdatedAt?: number;
  },
) {
  const effectiveQuery = {
    ...query,
    projectId: projectId ?? "",
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  };
  return useQuery({
    queryKey: [...PROJECT_TASKS_QUERY_KEY(projectId ?? ""), effectiveQuery],
    queryFn: () => fetchTasks(effectiveQuery),
    enabled: !!projectId,
    staleTime: 30 * 1000,
    initialData: options?.initialData,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
  });
}

export function useTaskQuery(
  taskId: string | null,
  options?: {
    initialData?: TaskView | null;
    initialDataUpdatedAt?: number;
  },
) {
  return useQuery({
    queryKey: TASK_QUERY_KEY(taskId ?? ""),
    queryFn: () => fetchTask(taskId!),
    enabled: !!taskId,
    staleTime: 30 * 1000,
    initialData: options?.initialData ?? undefined,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
  });
}

export const PROJECT_MEMBERS_QUERY_KEY = (projectId: string) =>
  ["projects", projectId, "members"] as const;

export function useProjectMembersQuery(
  projectId: string | null,
  options?: {
    initialData?: ProjectMembersView | null;
    initialDataUpdatedAt?: number;
  },
) {
  return useQuery({
    queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId ?? ""),
    queryFn: () => fetchProjectMembers(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
    initialData: options?.initialData ?? undefined,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
  });
}

export const USERS_QUERY_KEY = (search?: string) =>
  search?.trim()
    ? (["users", "search", search.trim()] as const)
    : (["users"] as const);

export function useUsersSearchQuery(search: string) {
  const enabled = search.trim().length >= 2;
  return useQuery({
    queryKey: USERS_QUERY_KEY(enabled ? search : undefined),
    queryFn: () => fetchUsers(search),
    enabled,
    staleTime: 60 * 1000,
  });
}

export const DASHBOARD_PROJECTS_QUERY: GetProjectsQueryDto = {
  page: 1,
  pageSize: 50,
  includeArchived: false,
  search: undefined,
  filter: "all",
  sort: "updated-desc",
};
export const DASHBOARD_TASKS_LIMIT = 5;

export const PROJECTS_LIST_PAGE_SIZE = 20;
export const DEFAULT_PROJECTS_LIST_QUERY: GetProjectsQueryDto = {
  page: 1,
  pageSize: PROJECTS_LIST_PAGE_SIZE,
  includeArchived: false,
  search: undefined,
  filter: "all",
  sort: "updated-desc",
};

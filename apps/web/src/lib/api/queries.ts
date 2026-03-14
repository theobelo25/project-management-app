import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMe,
  fetchProject,
  fetchProjectMembers,
  fetchProjects,
  fetchTask,
  fetchTasks,
  fetchUsers,
} from "./client";
import { FindTasksQuery, GetProjectsQueryDto } from "packages/types/dist";

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

export const PROJECTS_QUERY_KEY = ["projects"] as const;

export function useProjectsQuery(query: GetProjectsQueryDto) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, query],
    queryFn: () => fetchProjects(query),
    staleTime: 30 * 1000,
  });
}

export const PROJECT_QUERY_KEY = (id: string) => ["projects", id] as const;
export const PROJECT_TASKS_QUERY_KEY = (projectId: string) =>
  ["projects", projectId, "tasks"] as const;

export function useProjectQuery(projectId: string | null) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
}

export const TASK_QUERY_KEY = (taskId: string) => ["tasks", taskId] as const;

export function useProjectTasksQuery(
  projectId: string | null,
  query: Omit<FindTasksQuery, "projectId"> & { projectId?: string },
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
  });
}

export function useTaskQuery(taskId: string | null) {
  return useQuery({
    queryKey: TASK_QUERY_KEY(taskId ?? ""),
    queryFn: () => fetchTask(taskId!),
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

export const PROJECT_MEMBERS_QUERY_KEY = (projectId: string) =>
  ["projects", projectId, "members"] as const;

export function useProjectMembersQuery(projectId: string | null) {
  return useQuery({
    queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId ?? ""),
    queryFn: () => fetchProjectMembers(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
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

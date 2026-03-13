import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchMe, fetchProject, fetchProjects } from "./client";
import { GetProjectsQueryDto } from "packages/types/dist";

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

export function useProjectQuery(projectId: string | null) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
}

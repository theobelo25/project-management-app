import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchMe, fetchProjects } from "./client";
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

export const PROJECTS_QUERY_KEY = "projects" as const;

export function useProjectsQuery(query: GetProjectsQueryDto) {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, query],
    queryFn: () => fetchProjects(query),
    staleTime: 30 * 1000,
  });
}

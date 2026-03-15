"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type {
  GetProjectsQueryDto,
  PaginatedProjectsListView,
} from "packages/types/dist";

import {
  parseProjectsSearchParams,
  buildProjectsSearchParams,
  type ProjectsFilter as ParamFilter,
  type ProjectsSort as ParamSort,
} from "@web/app/(protected)/projects/params";
import { PageLayout } from "@web/components/layout/page-layout";
import {
  ProjectsWelcome,
  ProjectsToolbar,
  ProjectsList,
  ProjectsPagination,
  type ProjectsFilter,
  type ProjectsSort,
  type ProjectListItem,
} from "@web/components/projects";
import {
  useProjectsQuery,
  PROJECTS_LIST_PAGE_SIZE,
} from "@web/lib/api/queries";

type ProjectsPageContentProps = {
  initialData: PaginatedProjectsListView | null;
  initialQuery: GetProjectsQueryDto;
};

function mapItemToListItem(
  item: PaginatedProjectsListView["items"][number],
): ProjectListItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    currentUserRole: item.currentUserRole ?? "MEMBER",
    updatedAt: item.updatedAt,
    totalTasks: item.totalTasks,
    completedTasks: item.completedTasks,
    openTasks: item.openTasks,
    members: item.members,
  };
}

export function ProjectsPageContent({
  initialData,
  initialQuery,
}: ProjectsPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Read initial state from the query we used for SSR (so URL and state match on first paint)
  const { page, search, filter, sort } = useMemo(
    () => ({
      page: initialQuery.page ?? 1,
      search: initialQuery.search ?? "",
      filter: (initialQuery.filter ?? "all") as ParamFilter,
      sort: (initialQuery.sort ?? "updated-desc") as ParamSort,
    }),
    [
      initialQuery.page,
      initialQuery.search,
      initialQuery.filter,
      initialQuery.sort,
    ],
  );

  const query = useMemo<GetProjectsQueryDto>(
    () => ({
      page,
      pageSize: PROJECTS_LIST_PAGE_SIZE,
      includeArchived: filter === "archived",
      search: search.trim() || undefined,
      filter,
      sort,
    }),
    [page, filter, sort, search],
  );

  const { data, isLoading, isError, error } = useProjectsQuery(query, {
    initialData: initialData ?? undefined,
    initialDataUpdatedAt: initialData ? Date.now() - 30_000 : undefined,
  });

  const updateUrl = useCallback(
    (updates: {
      page?: number;
      search?: string;
      filter?: ParamFilter;
      sort?: ParamSort;
    }) => {
      const next = {
        page: updates.page ?? page,
        search: updates.search ?? search,
        filter: updates.filter ?? filter,
        sort: updates.sort ?? sort,
      };
      const qs = buildProjectsSearchParams(next);
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.push(href);
    },
    [pathname, router, page, search, filter, sort],
  );

  const handleSearchChange = useCallback(
    (value: string) => updateUrl({ search: value, page: 1 }),
    [updateUrl],
  );
  const handleFilterChange = useCallback(
    (value: ProjectsFilter) => updateUrl({ filter: value, page: 1 }),
    [updateUrl],
  );
  const handleSortChange = useCallback(
    (value: ProjectsSort) => updateUrl({ sort: value, page: 1 }),
    [updateUrl],
  );
  const handlePageChange = useCallback(
    (nextPage: number) => updateUrl({ page: nextPage }),
    [updateUrl],
  );

  const handleClear = useCallback(() => {
    updateUrl({
      page: 1,
      search: "",
      filter: "all",
      sort: "updated-desc",
    });
  }, [updateUrl]);

  const projects: ProjectListItem[] = useMemo(
    () => (data?.items ?? []).map(mapItemToListItem),
    [data?.items],
  );

  const totalCount = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const showPagination = totalPages > 1 && totalCount > 0;

  if (isError) {
    return (
      <>
        <ProjectsWelcome />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Failed to load projects</p>
          <p className="text-sm mt-1">
            {error?.message ?? "Something went wrong."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <ProjectsWelcome />

      <ProjectsToolbar
        search={search}
        filter={filter}
        sort={sort}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClear={handleClear}
      />

      {isLoading && !data ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-lg border bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <ProjectsList projects={projects} />
          {showPagination && (
            <ProjectsPagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={PROJECTS_LIST_PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}

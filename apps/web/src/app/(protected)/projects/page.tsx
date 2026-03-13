"use client";
import {
  ProjectsList,
  type ProjectListItem,
} from "@web/components/projects/projects-list";
import { Button } from "@web/components/ui/button";
import {
  ProjectsToolbar,
  type ProjectsFilter,
  type ProjectsSort,
} from "@web/components/projects/projects-toolbar";
import { useMemo, useState } from "react";
import { ProjectsPagination } from "@web/components/projects/projects-pagination";
import { useProjectsQuery } from "@web/lib/api/queries";
import { CreateProjectDialog } from "@web/components/projects/create-project-dialog";

const PAGE_SIZE = 20;

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProjectsFilter>("all");
  const [sort, setSort] = useState<ProjectsSort>("updated-desc");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      includeArchived: filter === "archived",
      search: search.trim() || undefined,
      filter,
      sort,
    }),
    [page, filter, sort, search],
  );

  const { data, isLoading, isError, error } = useProjectsQuery(query);

  function handleClear() {
    setSearch("");
    setFilter("all");
    setSort("updated-desc");
    setPage(1);
  }

  const projects: ProjectListItem[] = (data?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    currentUserRole: item.currentUserRole ?? "MEMBER",
    updatedAt: item.updatedAt,
    totalTasks: item.totalTasks,
    completedTasks: item.completedTasks,
    openTasks: item.openTasks,
    members: item.members,
  }));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage your projects, track progress, and collaborate with your
            team.
          </p>
        </div>

        <CreateProjectDialog />
      </div>

      <ProjectsToolbar
        search={search}
        filter={filter}
        sort={sort}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSortChange={setSort}
        onClear={handleClear}
      />

      <ProjectsList projects={projects} />

      <ProjectsPagination
        page={page}
        totalPages={data?.totalPages ?? 1}
        totalCount={data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}

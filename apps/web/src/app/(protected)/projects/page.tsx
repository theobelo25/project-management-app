"use client";
import {
  ProjectsList,
  type ProjectListItem,
} from "@web/components/projects/projects-list";
import { Button } from "@web/components/ui/button";
import { ProjectCard } from "../../../components/projects/project-card";
import {
  ProjectsToolbar,
  type ProjectsFilter,
  type ProjectsSort,
} from "@web/components/projects/projects-toolbar";
import { useState } from "react";
import { ProjectsPagination } from "@web/components/projects/projects-pagination";

const projects: ProjectListItem[] = [
  {
    id: "1",
    name: "Project Management App",
    description: "A collaborative project and task management platform.",
    currentUserRole: "OWNER",
    updatedAt: new Date(),
    totalTasks: 14,
    completedTasks: 5,
    openTasks: 9,
    members: [
      { id: "1", name: "Theo Belo" },
      { id: "2", name: "Kenzie Malone" },
      { id: "3", name: "Joel Smith" },
    ],
  },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProjectsFilter>("all");
  const [sort, setSort] = useState<ProjectsSort>("updated-desc");
  const [page, setPage] = useState(1);

  function handleClear() {
    setSearch("");
    setFilter("all");
    setSort("updated-desc");
  }

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

        <Button>Create Project</Button>
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
        totalPages={8}
        totalCount={64}
        pageSize={8}
        onPageChange={setPage}
      />
    </div>
  );
}

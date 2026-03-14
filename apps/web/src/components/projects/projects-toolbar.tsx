"use client";

import { Search, X } from "lucide-react";

import { Input } from "@web/components/ui/input";
import { Button } from "@web/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";

export type ProjectsFilter = "all" | "owned" | "member" | "archived";
export type ProjectsSort = "updated-desc" | "created-desc" | "name-asc";

type ProjectsToolbarProps = {
  search: string;
  filter: ProjectsFilter;
  sort: ProjectsSort;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: ProjectsFilter) => void;
  onSortChange: (value: ProjectsSort) => void;
  onClear?: () => void;
};

export function ProjectsToolbar({
  search,
  filter,
  sort,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onClear,
}: ProjectsToolbarProps) {
  const hasActiveFilters =
    search.trim().length > 0 || filter !== "all" || sort !== "updated-desc";

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>

        <Select
          value={filter}
          onValueChange={(value) => onFilterChange(value as ProjectsFilter)}
        >
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectItem value="owned">Owned by me</SelectItem>
            <SelectItem value="member">Member of</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as ProjectsSort)}
        >
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Recently updated" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Recently updated</SelectItem>
            <SelectItem value="created-desc">Recently created</SelectItem>
            <SelectItem value="name-asc">Name</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </section>
  );
}

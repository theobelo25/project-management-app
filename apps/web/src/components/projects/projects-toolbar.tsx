'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';

import { FilterToolbar } from './filter-toolbar';

export type ProjectsFilter = 'all' | 'owned' | 'member' | 'archived';
export type ProjectsSort = 'updated-desc' | 'created-desc' | 'name-asc';

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
    search.trim().length > 0 || filter !== 'all' || sort !== 'updated-desc';

  return (
    <FilterToolbar
      searchPlaceholder="Search projects..."
      searchValue={search}
      onSearchChange={onSearchChange}
      breakpoint="lg"
      showClear={hasActiveFilters}
      onClear={onClear}
      filters={
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
      }
      sortSlot={
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
      }
    />
  );
}

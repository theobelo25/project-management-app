"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import { FilterToolbar } from "../filter-toolbar";

export type TasksFilterStatus = "all" | "TODO" | "IN_PROGRESS" | "DONE";
export type TasksSort =
  | "updated-desc"
  | "created-desc"
  | "title-asc"
  | "status-asc";

type TasksToolbarAssignee = {
  id: string;
  name: string;
};

type TasksToolbarProps = {
  search: string;
  status: TasksFilterStatus;
  assigneeId: string;
  sort: TasksSort;
  assignees: TasksToolbarAssignee[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TasksFilterStatus) => void;
  onAssigneeChange: (value: string) => void;
  onSortChange: (value: TasksSort) => void;
  onClear?: () => void;
};

export function TasksToolbar({
  search,
  status,
  assigneeId,
  sort,
  assignees,
  onSearchChange,
  onStatusChange,
  onAssigneeChange,
  onSortChange,
  onClear,
}: TasksToolbarProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    status !== "all" ||
    assigneeId !== "all" ||
    sort !== "updated-desc";

  return (
    <FilterToolbar
      searchPlaceholder="Search tasks..."
      searchValue={search}
      onSearchChange={onSearchChange}
      breakpoint="xl"
      showClear={hasActiveFilters}
      onClear={onClear}
      filters={
        <>
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange(value as TasksFilterStatus)
            }
          >
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assigneeId} onValueChange={onAssigneeChange}>
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      sortSlot={
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as TasksSort)}
        >
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Recently updated" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Recently updated</SelectItem>
            <SelectItem value="created-desc">Recently created</SelectItem>
            <SelectItem value="title-asc">Title</SelectItem>
            <SelectItem value="status-asc">Status</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );
}

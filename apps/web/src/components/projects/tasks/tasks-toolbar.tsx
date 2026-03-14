"use client";

import { Search, X } from "lucide-react";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";

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
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-1">
        <div className="relative w-full xl:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as TasksFilterStatus)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
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
          <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={sort}
          onValueChange={(value) => onSortChange(value as TasksSort)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Recently updated" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Recently updated</SelectItem>
            <SelectItem value="created-desc">Recently created</SelectItem>
            <SelectItem value="title-asc">Title</SelectItem>
            <SelectItem value="status-asc">Status</SelectItem>
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
    </div>
  );
}

'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';

import { FilterToolbar } from '@web/components/projects/filter-toolbar';
import type { TaskLabelColor, TaskPriority, TaskStatus } from '@repo/types';
import { cn } from '@web/lib/utils';

import {
  TASK_LABEL_COLOR_OPTIONS,
  TASK_LABEL_COLOR_SWATCH_CLASS,
} from './task-label-color-styles';

export type TasksFilterStatus = 'all' | TaskStatus;
export type TasksFilterPriority = 'all' | TaskPriority;
export type TasksFilterLabelColor = 'all' | TaskLabelColor;
export type TasksSort =
  | 'updated-desc'
  | 'created-desc'
  | 'title-asc'
  | 'status-asc';

type TasksToolbarAssignee = {
  id: string;
  name: string;
};

type TasksToolbarProps = {
  search: string;
  status: TasksFilterStatus;
  priority: TasksFilterPriority;
  labelColor: TasksFilterLabelColor;
  assigneeId: string;
  sort: TasksSort;
  assignees: TasksToolbarAssignee[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TasksFilterStatus) => void;
  onPriorityChange: (value: TasksFilterPriority) => void;
  onLabelColorChange: (value: TasksFilterLabelColor) => void;
  onAssigneeChange: (value: string) => void;
  onSortChange: (value: TasksSort) => void;
  onClear?: () => void;
};

export function TasksToolbar({
  search,
  status,
  priority,
  labelColor,
  assigneeId,
  sort,
  assignees,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onLabelColorChange,
  onAssigneeChange,
  onSortChange,
  onClear,
}: TasksToolbarProps) {
  const hasActiveFilters =
    search.trim().length > 0 ||
    status !== 'all' ||
    priority !== 'all' ||
    labelColor !== 'all' ||
    assigneeId !== 'all' ||
    sort !== 'updated-desc';

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
              <SelectItem value="REVIEW">Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(value) =>
              onPriorityChange(value as TasksFilterPriority)
            }
          >
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={labelColor}
            onValueChange={(value) =>
              onLabelColorChange(value as TasksFilterLabelColor)
            }
          >
            <SelectTrigger className="w-full sm:w-45">
              <SelectValue placeholder="All label colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="flex items-center gap-2">
                  <span
                    className="size-3.5 shrink-0 rounded-full border border-dashed border-muted-foreground/45 bg-muted/30"
                    aria-hidden
                  />
                  All label colors
                </span>
              </SelectItem>
              {TASK_LABEL_COLOR_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'size-3.5 shrink-0 rounded-full ring-1 ring-border ring-inset',
                        TASK_LABEL_COLOR_SWATCH_CLASS[opt.value],
                      )}
                      aria-hidden
                    />
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
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

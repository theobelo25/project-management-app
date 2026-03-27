'use client';

import { useMemo, useState } from 'react';
import {
  PageErrorMessage,
  PageLoadingMessage,
  ProjectsPagination,
} from '@web/components/projects';
import {
  taskViewToListItem,
  TasksTable,
  TasksToolbar,
  type TasksFilterStatus,
  type TasksSort,
} from '@web/components/projects/tasks';
import { useProjectQuery, useProjectTasksQuery } from '@web/lib/api/queries';
import { useDeleteTask } from '@web/lib/api/mutations/use-delete-task';

type ProjectTasksPageContentProps = {
  projectId: string;
  pageSize: number;
};

export function ProjectTasksPageContent({
  projectId,
  pageSize: PAGE_SIZE,
}: ProjectTasksPageContentProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TasksFilterStatus>('all');
  const [assigneeId, setAssigneeId] = useState('all');
  const [sort, setSort] = useState<TasksSort>('updated-desc');
  const [page, setPage] = useState(1);

  const { data: project, isLoading: projectLoading } =
    useProjectQuery(projectId);
  const isReadOnly = !project?.currentUserRole;

  const { data: tasksResult } = useProjectTasksQuery(projectId, {
    projectId,
    page,
    limit: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
    assigneeId: assigneeId === 'all' ? undefined : assigneeId,
    search: search.trim() || undefined,
    sort,
  });

  const deleteTaskMutation = useDeleteTask(projectId);

  function handleDeleteTask(taskId: string) {
    deleteTaskMutation.mutate(taskId);
  }

  function handleClear() {
    setSearch('');
    setStatus('all');
    setAssigneeId('all');
    setSort('updated-desc');
    setPage(1);
  }

  const taskListItems = useMemo(
    () => (tasksResult?.data ?? []).map(taskViewToListItem),
    [tasksResult?.data],
  );
  const meta = tasksResult?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.pageCount ?? 1;

  const members = useMemo(() => {
    if (!project || !('members' in project) || !Array.isArray(project.members))
      return [];
    return (project.members as { id: string; name: string }[]).map((m) => ({
      id: m.id,
      name: m.name,
    }));
  }, [project]);

  if (!projectId) return null;

  if (projectLoading && !project) {
    return (
      <div className="flex flex-col gap-8">
        <PageLoadingMessage />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="flex flex-col gap-8">
        <PageErrorMessage message="Project not found" />
      </div>
    );
  }
  if (isReadOnly) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold">
          You do not have permission to view task details on this project
        </p>
        <p className="text-sm text-muted-foreground">
          Contact the project admin for assisstance
        </p>
      </div>
    );
  }

  return (
    <>
      <TasksToolbar
        search={search}
        status={status}
        assigneeId={assigneeId}
        sort={sort}
        assignees={members}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onAssigneeChange={(value) => {
          setAssigneeId(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onClear={handleClear}
      />

      <TasksTable
        projectId={project.id}
        tasks={taskListItems}
        onDelete={handleDeleteTask}
        emptyTitle={
          isReadOnly
            ? 'You do not have permission to view task details on this project'
            : totalCount === 0 && (tasksResult?.data?.length ?? 0) > 0
              ? 'No tasks match your filters'
              : 'No tasks yet'
        }
        emptyDescription={
          isReadOnly
            ? 'Contact the project admin for assisstance'
            : totalCount === 0 && (tasksResult?.data?.length ?? 0) > 0
              ? "Try adjusting your search or filters to find what you're looking for."
              : 'Create your first task to start tracking work in this project.'
        }
      />

      {totalCount > 0 ? (
        <ProjectsPagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      ) : null}
    </>
  );
}

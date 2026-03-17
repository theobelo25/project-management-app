"use client";

import { useCallback, useMemo } from "react";
import {
  InvalidProjectMessage,
  PageErrorMessage,
  PageLoadingMessage,
} from "@web/components/projects";
import { useProjectQuery, useProjectTasksQuery } from "@web/lib/api/queries";
import { useUpdateTaskStatus } from "@web/lib/api/mutations/use-update-task-status";
import { Board } from "./board";
import { taskViewToBoardTask } from "./task-view-to-board-task";
import { groupTasksByStatus, BOARD_COLUMNS } from "./types";
import type { BoardTask, TaskStatus } from "./types";

const BOARD_TASKS_LIMIT = 100;

type ProjectBoardPageContentProps = {
  projectId: string;
};

export function ProjectBoardPageContent({
  projectId,
}: ProjectBoardPageContentProps) {
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useProjectQuery(projectId);

  const { data: tasksResult, isLoading: tasksLoading } = useProjectTasksQuery(
    projectId,
    {
      projectId,
      page: 1,
      limit: BOARD_TASKS_LIMIT,
    },
  );

  const updateStatusMutation = useUpdateTaskStatus(projectId);

  const tasks: BoardTask[] = useMemo(
    () => (tasksResult?.data ?? []).map(taskViewToBoardTask),
    [tasksResult?.data],
  );

  const grouped = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  const onMoveTask = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      updateStatusMutation.mutate({ taskId, status: newStatus });
    },
    [updateStatusMutation],
  );

  const isLoading = isProjectLoading || tasksLoading;
  if (isLoading) return <PageLoadingMessage />;

  if (isProjectError || !project) {
    return projectError?.message ? (
      <PageErrorMessage message={projectError.message} />
    ) : (
      <InvalidProjectMessage />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Board
        projectId={project.id}
        columns={BOARD_COLUMNS}
        grouped={grouped}
        onMoveTask={onMoveTask}
      />
    </div>
  );
}

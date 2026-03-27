'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  InvalidProjectMessage,
  PageErrorMessage,
  PageLoadingMessage,
} from '@web/components/projects';
import { useProjectQuery, useProjectTasksQuery } from '@web/lib/api/queries';
import { useUpdateTaskDueDate } from '@web/lib/api/mutations/use-update-task-due-date';
import { MonthCalendar } from './month-calendar';
import { getCalendarDaysForMonth } from './calendar-days';
import { formatMonthLabel, getTodayDateString } from './format';
import { taskViewToCalendarTask } from './task-view-to-calendar-task';
import type { CalendarDay, CalendarTask } from './types';

const CALENDAR_TASKS_LIMIT = 100;

type ProjectCalendarPageContentProps = {
  projectId: string;
};

export function ProjectCalendarPageContent({
  projectId,
}: ProjectCalendarPageContentProps) {
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date().getMonth() + 1,
  );

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
      limit: CALENDAR_TASKS_LIMIT,
    },
  );

  const updateDueDateMutation = useUpdateTaskDueDate(projectId);
  const canEditTasks = !!project?.currentUserRole;

  const handleDueDateChange = useCallback(
    (taskId: string, dueDate: string) => {
      if (!canEditTasks) return;
      updateDueDateMutation.mutate({ taskId, dueDate });
    },
    [canEditTasks, updateDueDateMutation],
  );

  const calendarTasks = useMemo(() => {
    const items = tasksResult?.data ?? [];
    return items
      .map(taskViewToCalendarTask)
      .filter((t): t is CalendarTask => t != null);
  }, [tasksResult?.data]);

  const calendarDays = useMemo<CalendarDay[]>(
    () => getCalendarDaysForMonth(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const monthLabel = formatMonthLabel(currentYear, currentMonth);
  const today = getTodayDateString();

  function getTasksForDate(date: string): CalendarTask[] {
    return calendarTasks.filter((task) => task.dueDate === date);
  }

  function goToPrevMonth() {
    if (currentMonth <= 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (currentMonth >= 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  if (isProjectLoading || tasksLoading) {
    return <PageLoadingMessage />;
  }

  if (isProjectError || !project) {
    return projectError?.message ? (
      <PageErrorMessage message={projectError.message} />
    ) : (
      <InvalidProjectMessage />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <MonthCalendar
        monthLabel={monthLabel}
        days={calendarDays}
        getTasksForDate={getTasksForDate}
        today={today}
        canEditTasks={canEditTasks}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onDueDateChange={handleDueDateChange}
      />
    </div>
  );
}

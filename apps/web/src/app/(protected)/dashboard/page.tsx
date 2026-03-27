import { DashboardContent } from '@web/components/dashboard/dashboard-content';
import {
  fetchProjectsServer,
  fetchTasksServer,
} from '@web/lib/api/server-client';
import {
  DASHBOARD_PROJECTS_QUERY,
  DASHBOARD_TASKS_LIMIT,
} from '@web/lib/api/queries';

export default async function DashboardPage() {
  let initialProjects = null;
  let initialTasks = null;
  let firstProjectId: string | null = null;

  try {
    initialProjects = await fetchProjectsServer(DASHBOARD_PROJECTS_QUERY);
    firstProjectId = initialProjects.items[0]?.id ?? null;

    if (firstProjectId) {
      try {
        initialTasks = await fetchTasksServer({
          projectId: firstProjectId,
          page: 1,
          limit: DASHBOARD_TASKS_LIMIT,
        });
      } catch {
        initialTasks = {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: DASHBOARD_TASKS_LIMIT,
            pageCount: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
    } else {
      initialTasks = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: DASHBOARD_TASKS_LIMIT,
          pageCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  } catch {
    initialProjects = null;
    initialTasks = null;
  }

  return (
    <DashboardContent
      initialProjects={initialProjects}
      initialTasks={initialTasks}
      firstProjectId={firstProjectId}
    />
  );
}

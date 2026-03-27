import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from '@tanstack/react-query';
import {
  fetchProjectServer,
  fetchProjectMembersServer,
  fetchTasksServer,
  fetchTaskServer,
} from './server-client';
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
  PROJECT_MEMBERS_QUERY_KEY,
  TASK_QUERY_KEY,
} from './queries';

export function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
    },
  });
}

export async function prefetchProject(
  client: QueryClient,
  projectId: string,
): Promise<void> {
  await client.prefetchQuery({
    queryKey: PROJECT_QUERY_KEY(projectId),
    queryFn: () => fetchProjectServer(projectId),
  });
}

export async function prefetchProjectTasks(
  client: QueryClient,
  projectId: string,
  page = 1,
  limit = 10,
): Promise<void> {
  const query = {
    projectId,
    page,
    limit,
  };
  await client.prefetchQuery({
    queryKey: [...PROJECT_TASKS_QUERY_KEY(projectId), query],
    queryFn: () => fetchTasksServer({ projectId, page, limit }),
  });
}

export async function prefetchProjectMembers(
  client: QueryClient,
  projectId: string,
): Promise<void> {
  await client.prefetchQuery({
    queryKey: PROJECT_MEMBERS_QUERY_KEY(projectId),
    queryFn: () => fetchProjectMembersServer(projectId),
  });
}

export async function prefetchTask(
  client: QueryClient,
  taskId: string,
): Promise<void> {
  await client.prefetchQuery({
    queryKey: TASK_QUERY_KEY(taskId),
    queryFn: () => fetchTaskServer(taskId),
  });
}

export function dehydrateClient(client: QueryClient): DehydratedState {
  return dehydrate(client);
}

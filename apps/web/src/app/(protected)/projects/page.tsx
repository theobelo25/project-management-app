import { fetchProjectsServer } from '@web/lib/api/server-client';
import {
  DEFAULT_PROJECTS_LIST_QUERY,
  PROJECTS_LIST_PAGE_SIZE,
} from '@web/lib/api/queries';
import { ProjectsPageContent } from '@web/components/projects';
import { parseProjectsSearchParams } from './params';

export const metadata = {
  title: 'Projects',
  description:
    'Manage your projects, track progress, and collaborate with your team.',
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { page, search, filter, sort } =
    parseProjectsSearchParams(resolvedParams);

  const initialQuery = {
    ...DEFAULT_PROJECTS_LIST_QUERY,
    page,
    pageSize: PROJECTS_LIST_PAGE_SIZE,
    includeArchived: filter === 'archived',
    search:
      (typeof search === 'string' ? search : (search?.[0] ?? '')).trim() ||
      undefined,
    filter,
    sort,
  };

  let initialData = null;
  try {
    initialData = await fetchProjectsServer(initialQuery);
  } catch {
    initialData = null;
  }

  return (
    <ProjectsPageContent
      initialData={initialData}
      initialQuery={initialQuery}
    />
  );
}

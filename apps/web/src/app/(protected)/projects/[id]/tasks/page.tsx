import {
  fetchProjectServer,
  fetchTasksServer,
} from "@web/lib/api/server-client";
import { PageLayout } from "@web/components/layout/page-layout";
import { notFound } from "next/navigation";
import { ProjectTasksPageContent } from "@web/components/projects/tasks";

const PAGE_SIZE = 10;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectTasksPage({ params }: PageProps) {
  const { id: projectId } = await params;

  let initialProject = null;
  let initialTasks = null;

  try {
    const [projectRes, tasksRes] = await Promise.all([
      fetchProjectServer(projectId),
      fetchTasksServer({
        projectId,
        page: 1,
        limit: PAGE_SIZE,
      }),
    ]);
    initialProject = projectRes;
    initialTasks = tasksRes;
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message === "Project not found") notFound();
    initialProject = null;
    initialTasks = null;
  }

  return (
    <PageLayout>
      <ProjectTasksPageContent
        projectId={projectId}
        initialProject={initialProject}
        initialTasks={initialTasks}
        pageSize={PAGE_SIZE}
      />
    </PageLayout>
  );
}

import { ProjectTasksPageContent } from "@web/components/projects/tasks";

const PAGE_SIZE = 10;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectTasksPage({ params }: PageProps) {
  const { id: projectId } = await params;
  return <ProjectTasksPageContent projectId={projectId} pageSize={PAGE_SIZE} />;
}

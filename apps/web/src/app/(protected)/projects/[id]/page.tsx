import { ProjectDetailContent } from '@web/components/projects/project-detail';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectDetailContent projectId={id} />;
}

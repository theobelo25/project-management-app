import { ProjectBoardPageContent } from '@web/components/board';
type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function ProjectBoardPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectBoardPageContent projectId={id} />;
}

import { ProjectMembersPageContent } from '@web/components/projects/members';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectMembersPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectMembersPageContent projectId={id} />;
}

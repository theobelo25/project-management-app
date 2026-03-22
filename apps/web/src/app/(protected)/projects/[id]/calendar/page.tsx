import { ProjectCalendarPageContent } from '@web/components/calendar';
type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function ProjectCalendarPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectCalendarPageContent projectId={id} />;
}

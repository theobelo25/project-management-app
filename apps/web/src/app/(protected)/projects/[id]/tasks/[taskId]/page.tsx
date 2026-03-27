import { TaskDetailPageContent } from '@web/components/projects/task-detail';

type PageProps = {
  params: Promise<{ id: string; taskId: string }>;
};

export default async function TaskDetailPage({ params }: PageProps) {
  const { id: projectId, taskId } = await params;
  return <TaskDetailPageContent projectId={projectId} taskId={taskId} />;
}

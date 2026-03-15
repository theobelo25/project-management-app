import { fetchTaskServer } from "@web/lib/api/server-client";
import { PageLayout } from "@web/components/layout/page-layout";
import { notFound } from "next/navigation";
import { TaskDetailPageContent } from "@web/components/projects/taskDetail";

type PageProps = {
  params: Promise<{ id: string; taskId: string }>;
};

export default async function TaskDetailPage({ params }: PageProps) {
  const { id: projectId, taskId } = await params;

  let initialTask = null;

  try {
    initialTask = await fetchTaskServer(taskId);
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message === "Task not found") notFound();
    initialTask = null;
  }

  return (
    <PageLayout>
      <TaskDetailPageContent
        projectId={projectId}
        taskId={taskId}
        initialTask={initialTask}
      />
    </PageLayout>
  );
}

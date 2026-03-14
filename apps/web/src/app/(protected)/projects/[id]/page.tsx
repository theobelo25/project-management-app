import { fetchProjectServer } from "@web/lib/api/server-client";
import { ProjectDetailContent } from "@web/components/projects/projectDetail";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  let initialProject = null;
  try {
    initialProject = await fetchProjectServer(id);
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message === "Project not found") notFound();
    initialProject = null;
  }

  return (
    <ProjectDetailContent projectId={id} initialProject={initialProject} />
  );
}

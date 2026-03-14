import {
  fetchProjectMembersServer,
  fetchProjectServer,
} from "@web/lib/api/server-client";
import { PageLayout } from "@web/components/layout/page-layout";
import { notFound } from "next/navigation";
import { ProjectMembersPageContent } from "@web/components/projects/members/project-members-page-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectMembersPage({ params }: PageProps) {
  const { id } = await params;

  let initialProject = null;
  let initialMembers = null;

  try {
    const [projectRes, membersRes] = await Promise.all([
      fetchProjectServer(id),
      fetchProjectMembersServer(id),
    ]);
    initialProject = projectRes;
    initialMembers = membersRes;
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message === "Project not found") notFound();
    initialProject = null;
    initialMembers = null;
  }

  return (
    <PageLayout>
      <ProjectMembersPageContent
        projectId={id}
        initialProject={initialProject}
        initialMembers={initialMembers}
      />
    </PageLayout>
  );
}

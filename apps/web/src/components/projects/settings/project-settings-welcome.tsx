import { BackLink, PageHeader } from "@web/components/projects";
import { ROUTES } from "@web/lib/routes";
import type { ProjectDetailView } from "@repo/types";

type ProjectSettingsWelcomeProps = {
  project: Pick<ProjectDetailView, "id" | "name">;
};

export function ProjectSettingsWelcome({
  project,
}: ProjectSettingsWelcomeProps) {
  return (
    <PageHeader
      backLink={
        <BackLink href={`${ROUTES.projects}/${project.id}`}>
          Back to Project
        </BackLink>
      }
      title="Project Settings"
      description={
        <>
          Manage project details, members, and administrative actions for{" "}
          <span className="font-medium">{project.name}</span>.
        </>
      }
    />
  );
}

import { ProjectDetailView } from "@repo/types";
import { ROUTES } from "@web/lib/routes";
import { PageHeader, BackLink } from "@web/components/projects";

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

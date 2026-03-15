import { CreateProjectDialog, PageHeader } from "@web/components/projects";

export function ProjectsWelcome() {
  return (
    <PageHeader
      title="Projects"
      description="Manage your projects, track progress, and collaborate with your team."
      actions={<CreateProjectDialog />}
    />
  );
}

import { BackLink, PageHeader } from "@web/components/projects";
import { CreateTaskDialog } from "@web/components/projects/tasks";
import { ROUTES } from "@web/lib/routes";

type TasksWelcomeProps = {
  project: {
    id: string;
    name: string;
  };
};

export function TasksWelcome({ project }: TasksWelcomeProps) {
  return (
    <PageHeader
      backLink={
        <BackLink href={`${ROUTES.projects}/${project.id}`}>
          Back to Project
        </BackLink>
      }
      title="Tasks"
      description={
        <>
          Manage all tasks in{" "}
          <span className="font-medium">{project.name}</span>.
        </>
      }
      actions={<CreateTaskDialog projectId={project.id} />}
    />
  );
}

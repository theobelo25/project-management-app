import { ProjectCard, ProjectsEmptyState } from "@web/components/projects";
import { ProjectListItemView } from "@repo/types";

type ProjectsListProps = {
  projects: ProjectListItemView[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ProjectsList({
  projects,
  emptyTitle = "No projects yet",
  emptyDescription = "Create your first project to start organizing tasks and collaborating with your team.",
}: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <ProjectsEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

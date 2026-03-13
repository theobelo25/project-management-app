import { ProjectCard } from "@web/components/projects/project-card";
import { ProjectsEmptyState } from "@web/components/projects/projects-empty-state";

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export type ProjectMember = {
  id: string;
  name: string;
  image?: string | null;
};

export type ProjectListItem = {
  id: string;
  name: string;
  description: string | null;
  currentUserRole: ProjectRole;
  updatedAt: string | Date;
  totalTasks: number;
  completedTasks: number;
  openTasks: number;
  members: ProjectMember[];
};

type ProjectsListProps = {
  projects: ProjectListItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  createHref?: string;
  createLabel?: string;
};

export function ProjectsList({
  projects,
  emptyTitle = "No projects yet",
  emptyDescription = "Create your first project to start organizing tasks and collaborating with your team.",
  createHref = "/projects/new",
  createLabel = "Create Project",
}: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <ProjectsEmptyState
        title={emptyTitle}
        description={emptyDescription}
        createHref={createHref}
        createLabel={createLabel}
      />
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

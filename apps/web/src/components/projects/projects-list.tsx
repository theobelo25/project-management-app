import { ProjectCard, ProjectsEmptyState } from '@web/components/projects';
import type { ProjectListItemView } from '@repo/types';
import { PROJECTS_EMPTY_STATE } from './constants';

type ProjectsListProps = {
  projects: ProjectListItemView[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ProjectsList({
  projects,
  emptyTitle = PROJECTS_EMPTY_STATE.title,
  emptyDescription = PROJECTS_EMPTY_STATE.description,
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

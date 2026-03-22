import { FolderKanban } from 'lucide-react';
import { CreateProjectDialog, EmptyStateCard } from '@web/components/projects';
import { PROJECTS_EMPTY_STATE } from './constants';
type ProjectsEmptyStateProps = {
  title?: string;
  description?: string;
};
export function ProjectsEmptyState({
  title = PROJECTS_EMPTY_STATE.title,
  description = PROJECTS_EMPTY_STATE.description,
}: ProjectsEmptyStateProps) {
  return (
    <EmptyStateCard
      icon={<FolderKanban className="h-6 w-6 text-muted-foreground" />}
      title={title}
      description={description}
    >
      <CreateProjectDialog />
    </EmptyStateCard>
  );
}

'use client';

import { CreateEntityDialog } from '@web/components/projects/create-entity-dialog';
import { ProjectForm } from '@web/components/projects/project-form';

export function CreateProjectDialog() {
  return (
    <CreateEntityDialog
      triggerLabel="Create Project"
      dialogTitle="Create project"
      dialogDescription="Start a new project to organize tasks and collaborate with your team."
    >
      {({ onSuccess }) => <ProjectForm onSuccess={onSuccess} />}
    </CreateEntityDialog>
  );
}

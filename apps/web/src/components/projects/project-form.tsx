'use client';

import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';
import { Textarea } from '@web/components/ui/textarea';
import {
  CreateProjectSchema,
  type CreateProjectDto,
  type ProjectView,
} from '@repo/types';
import { useCreateProject } from '@web/lib/api/mutations/use-create-project';

type ProjectFormProps = {
  isLoading?: boolean;
  onSuccess?: (project: ProjectView) => void;
  submitLabel?: string;
};

export function ProjectForm({
  isLoading = false,
  onSuccess,
  submitLabel = 'Create Project',
}: ProjectFormProps) {
  const createProjectMutation = useCreateProject({ onSuccess });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectDto>({
    resolver: standardSchemaResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (values: CreateProjectDto) => {
    createProjectMutation.mutate(values, {
      onSuccess: (project) => {
        reset();
        onSuccess?.(project);
      },
    });
  };

  const submitting =
    isSubmitting || isLoading || createProjectMutation.isPending;

  const rootError = createProjectMutation.error?.message ?? null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-describedby={rootError ? 'project-form-root-error' : undefined}
    >
      {rootError ? (
        <div
          id="project-form-root-error"
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {rootError}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="project-name">Name</Label>
        <Input
          id="project-name"
          placeholder="e.g. Website Redesign"
          autoComplete="off"
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'project-name-error' : undefined}
        />
        {errors.name?.message ? (
          <p id="project-name-error" role="alert" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          placeholder="Optional"
          rows={4}
          {...register('description')}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? 'project-description-error' : undefined
          }
        />
        {errors.description?.message ? (
          <p
            id="project-description-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Creating…' : submitLabel}
      </Button>
    </form>
  );
}

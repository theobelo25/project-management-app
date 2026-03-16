"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";
import {
  CreateProjectSchema,
  type CreateProjectDto,
  type ProjectView,
} from "@repo/types";
import { useCreateProject } from "@web/lib/api/mutations/use-create-project";

type ProjectFormProps = {
  isLoading?: boolean;
  onSuccess?: (project: ProjectView) => void;
  submitLabel?: string;
};

export function ProjectForm({
  isLoading = false,
  onSuccess,
  submitLabel = "Create Project",
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
      name: "",
      description: "",
    },
    mode: "onBlur",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* ... rest unchanged: fields, error, Button ... */}
    </form>
  );
}

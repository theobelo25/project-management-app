"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";
import { createProject } from "@web/lib/api/client";
import { PROJECTS_QUERY_KEY } from "@web/lib/api/queries";
import {
  CreateProjectSchema,
  type CreateProjectDto,
  type ProjectView,
} from "@repo/types";

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
  const router = useRouter();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      onSuccess?.(project);
      toast.success("Project creted successfully!");
      router.push(`/projects/${project.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const onSubmit = (values: CreateProjectDto) => {
    createProjectMutation.mutate(values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectDto>({
    resolver: standardSchemaResolver(CreateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onBlur",
  });

  const submitting =
    isSubmitting || isLoading || createProjectMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Website Redesign"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Briefly describe what this project is about"
          rows={4}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {createProjectMutation.error && (
        <p className="text-sm text-destructive">
          {createProjectMutation.error.message || "Failed to create project."}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Creating Project..." : submitLabel}
      </Button>
    </form>
  );
}

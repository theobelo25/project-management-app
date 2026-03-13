"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTask } from "@web/lib/api/client";
import {
  PROJECT_QUERY_KEY,
  PROJECT_TASKS_QUERY_KEY,
} from "@web/lib/api/queries";

import {
  CreateTaskSchema,
  type CreateTaskDto,
  type TaskView,
} from "@repo/types";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";

type TaskFormProps = {
  projectId: string;
  isLoading?: boolean;
  onSuccess?: (task: TaskView) => void;
  submitLabel?: string;
};

export function TaskForm({
  projectId,
  isLoading = false,
  onSuccess,
  submitLabel = "Create Task",
}: TaskFormProps) {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (values: CreateTaskDto) => createTask(projectId, values),
    onSuccess: (task) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_TASKS_QUERY_KEY(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: PROJECT_QUERY_KEY(projectId),
      });

      onSuccess?.(task);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const onSubmit = (values: CreateTaskDto) => {
    createTaskMutation.mutate(values);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskDto>({
    resolver: standardSchemaResolver(CreateTaskSchema),
    defaultValues: {
      projectId,
      title: "",
      description: "",
    },
    mode: "onBlur",
  });

  const submitting = isSubmitting || isLoading || createTaskMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        reset({
          projectId,
          title: "",
          description: "",
        });
      })}
      noValidate
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Task title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Finish project toolbar"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add search, filter, and sort controls to the projects page"
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

      {createTaskMutation.error && (
        <p className="text-sm text-destructive">
          {createTaskMutation.error.message || "Failed to create task."}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Creating Task..." : submitLabel}
      </Button>
    </form>
  );
}

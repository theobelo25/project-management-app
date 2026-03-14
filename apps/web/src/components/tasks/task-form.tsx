"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

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
  onSubmit: (values: CreateTaskDto) => void | Promise<void>;
  onSuccess?: (task: TaskView) => void;
  submitLabel?: string;
  defaultValues?: Partial<CreateTaskDto>;
  errorMessage?: string | null;
};

export function TaskForm({
  projectId,
  isLoading = false,
  onSubmit,
  submitLabel = "Create Task",
  defaultValues,
  errorMessage,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskDto>({
    resolver: standardSchemaResolver(CreateTaskSchema),
    defaultValues: {
      projectId,
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      projectId,
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    });
  }, [defaultValues, projectId, reset]);

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
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

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? `${submitLabel}...` : submitLabel}
      </Button>
    </form>
  );
}

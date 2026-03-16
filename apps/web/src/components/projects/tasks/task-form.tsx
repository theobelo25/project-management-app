"use client";

import { useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Textarea } from "@web/components/ui/textarea";

type TaskFormProps<TValues extends FieldValues> = {
  projectId: string;
  schema: unknown;
  isLoading?: boolean;
  onSubmit: (values: TValues) => void | Promise<void>;
  submitLabel?: string;
  defaultValues?: Partial<TValues>;
  errorMessage?: string | null;
};

export function TaskForm<TValues extends FieldValues>({
  projectId,
  schema,
  isLoading = false,
  onSubmit,
  submitLabel,
  defaultValues,
  errorMessage,
}: TaskFormProps<TValues>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TValues>({
    resolver: standardSchemaResolver(schema as never),
    defaultValues: {
      ...(defaultValues ?? {}),
      projectId,
    } as never,
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      ...(defaultValues ?? {}),
      projectId,
    } as never);
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
          aria-invalid={!!(errors as any).title}
          {...register("title" as never)}
        />
        {(errors as any).title && (
          <p className="text-sm text-destructive">
            {(errors as any).title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add search, filter, and sort controls to the projects page"
          rows={4}
          aria-invalid={!!(errors as any).description}
          {...register("description" as never)}
        />
        {(errors as any).description && (
          <p className="text-sm text-destructive">
            {(errors as any).description.message}
          </p>
        )}
      </div>

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? `${submitLabel ?? "Save"}...` : (submitLabel ?? "Save")}
      </Button>
    </form>
  );
}

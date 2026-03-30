'use client';

import { useEffect } from 'react';
import { Controller, useForm, type FieldValues } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/select';
import { Textarea } from '@web/components/ui/textarea';
import { cn } from '@web/lib/utils';

import {
  TASK_LABEL_COLOR_OPTIONS,
  TASK_LABEL_COLOR_SWATCH_CLASS,
} from './task-label-color-styles';

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
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TValues>({
    resolver: standardSchemaResolver(schema as never),
    defaultValues: {
      ...(defaultValues ?? {}),
      projectId,
    } as never,
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset({
      ...(defaultValues ?? {}),
      projectId,
    } as never);
  }, [defaultValues, projectId, reset]);

  const submitting = isSubmitting || isLoading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-describedby={errorMessage ? 'task-form-server-error' : undefined}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Task title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Finish project toolbar"
          aria-invalid={!!(errors as any).title}
          aria-describedby={
            (errors as any).title ? 'task-title-error' : undefined
          }
          {...register('title' as never)}
        />
        {(errors as any).title && (
          <p
            id="task-title-error"
            role="alert"
            className="text-sm text-destructive"
          >
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
          aria-describedby={
            (errors as any).description ? 'task-description-error' : undefined
          }
          {...register('description' as never)}
        />
        {(errors as any).description && (
          <p
            id="task-description-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {(errors as any).description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-priority">Priority</Label>
        <Controller
          name={'priority' as never}
          control={control as never}
          render={({ field }) => (
            <Select
              value={field.value ?? 'MEDIUM'}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="task-priority"
                className="w-full"
                aria-invalid={!!(errors as any).priority}
                aria-describedby={
                  (errors as any).priority ? 'task-priority-error' : undefined
                }
              >
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {(errors as any).priority && (
          <p
            id="task-priority-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {(errors as any).priority.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium leading-none">Label color</span>
        <p className="text-xs text-muted-foreground">
          Optional color to group this task in lists and on the board.
        </p>
        <Controller
          name={'labelColor' as never}
          control={control as never}
          render={({ field }) => (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Task label color"
            >
              {TASK_LABEL_COLOR_OPTIONS.map((opt) => {
                const selected = (field.value ?? 'NONE') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selected
                        ? 'border-primary ring-2 ring-ring'
                        : 'border-transparent',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-6 w-6 rounded-full',
                        TASK_LABEL_COLOR_SWATCH_CLASS[opt.value],
                      )}
                      aria-hidden
                    />
                    <span className="sr-only">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {(errors as any).labelColor && (
          <p
            id="task-label-color-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {(errors as any).labelColor.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          type="date"
          aria-invalid={!!(errors as any).dueDate}
          aria-describedby={
            (errors as any).dueDate ? 'task-due-date-error' : undefined
          }
          {...register('dueDate' as never)}
        />
        {(errors as any).dueDate && (
          <p
            id="task-due-date-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {(errors as any).dueDate.message}
          </p>
        )}
      </div>

      {errorMessage ? (
        <p
          id="task-form-server-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? `${submitLabel ?? 'Save'}...` : (submitLabel ?? 'Save')}
      </Button>
    </form>
  );
}

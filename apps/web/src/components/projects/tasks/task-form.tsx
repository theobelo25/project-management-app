'use client';

import { useEffect } from 'react';
import {
  Controller,
  useForm,
  type FieldError,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form';
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

function fieldError<TValues extends FieldValues>(
  errors: FieldErrors<TValues>,
  key: string,
): FieldError | undefined {
  const e = errors[key as keyof FieldErrors<TValues>];
  if (e == null || typeof e !== 'object') return undefined;
  return e as FieldError;
}

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
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
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
          aria-invalid={!!fieldError(errors, 'title')}
          aria-describedby={
            fieldError(errors, 'title') ? 'task-title-error' : undefined
          }
          {...register('title' as never)}
        />
        {fieldError(errors, 'title') ? (
          <p
            id="task-title-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldError(errors, 'title')?.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add search, filter, and sort controls to the projects page"
          rows={4}
          aria-invalid={!!fieldError(errors, 'description')}
          aria-describedby={
            fieldError(errors, 'description')
              ? 'task-description-error'
              : undefined
          }
          {...register('description' as never)}
        />
        {fieldError(errors, 'description') ? (
          <p
            id="task-description-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldError(errors, 'description')?.message}
          </p>
        ) : null}
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
                aria-invalid={!!fieldError(errors, 'priority')}
                aria-describedby={
                  fieldError(errors, 'priority')
                    ? 'task-priority-error'
                    : undefined
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
        {fieldError(errors, 'priority') ? (
          <p
            id="task-priority-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldError(errors, 'priority')?.message}
          </p>
        ) : null}
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
        {fieldError(errors, 'labelColor') ? (
          <p
            id="task-label-color-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldError(errors, 'labelColor')?.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          type="date"
          aria-invalid={!!fieldError(errors, 'dueDate')}
          aria-describedby={
            fieldError(errors, 'dueDate') ? 'task-due-date-error' : undefined
          }
          {...register('dueDate' as never)}
        />
        {fieldError(errors, 'dueDate') ? (
          <p
            id="task-due-date-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {fieldError(errors, 'dueDate')?.message}
          </p>
        ) : null}
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

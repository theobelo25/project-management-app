'use client';

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@web/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web/components/ui/dialog';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';
import {
  CreateOrganizationSchema,
  type CreateOrganizationDto,
} from '@repo/types';
import { useCreateOrganizationMutation } from '@web/lib/api/queries';

type CreateOrganizationDialogProps = {
  trigger?: ReactNode;
  triggerLabel?: string;
};

export function CreateOrganizationDialog({
  trigger,
  triggerLabel = 'New organization',
}: CreateOrganizationDialogProps) {
  const [open, setOpen] = useState(false);
  const createOrganizationMutation = useCreateOrganizationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationDto>({
    resolver: standardSchemaResolver(CreateOrganizationSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: CreateOrganizationDto) => {
    try {
      await createOrganizationMutation.mutateAsync(values);
      reset({ name: '' });
      createOrganizationMutation.reset();
      setOpen(false);
      toast.success('Organization created');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create organization',
      );
    }
  };

  const submitting = isSubmitting || createOrganizationMutation.isPending;
  const rootError = createOrganizationMutation.error?.message ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset({ name: '' });
          createOrganizationMutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Start a new workspace and make it active right away.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {rootError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {rootError}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="organization-name">Name</Label>
            <Input
              id="organization-name"
              placeholder="e.g. Acme Studio"
              autoComplete="off"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name?.message ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create organization'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { toast } from 'sonner';

import { UserView } from '@repo/types';
import { ROUTES } from '@web/lib/routes';
import { useUpdateMe } from '@web/lib/api/mutations/use-update-me';

import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/,
    'Password must contain at least one special character',
  );

const optionalPasswordSchema = z
  .string()
  .max(128)
  .superRefine((value, ctx) => {
    if (value.trim() === '') return;
    const parsed = passwordSchema.safeParse(value);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) =>
        ctx.addIssue({
          ...issue,
          path: ['password'],
        }),
      );
    }
  });

const optionalConfirmPasswordSchema = z
  .string()
  .max(128)
  .superRefine((value, ctx) => {
    if (value.trim() === '') return;
    const parsed = z.string().min(8).safeParse(value);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) =>
        ctx.addIssue({
          ...issue,
          path: ['confirmPassword'],
        }),
      );
    }
  });

const UpdateProfileFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(200),
    email: z.email(),
    password: optionalPasswordSchema.optional(),
    confirmPassword: optionalConfirmPasswordSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const password = (data.password ?? '').trim();
    const confirmPassword = (data.confirmPassword ?? '').trim();

    const hasPassword = password.length > 0;
    const hasConfirm = confirmPassword.length > 0;

    if (!hasPassword && !hasConfirm) return;

    if (hasPassword && !hasConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please confirm your new password',
        path: ['confirmPassword'],
      });
      return;
    }

    if (!hasPassword && hasConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a new password',
        path: ['password'],
      });
      return;
    }

    if (hasPassword && hasConfirm && password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type UpdateProfileFormValues = z.infer<typeof UpdateProfileFormSchema>;

type ProfileFormProps = {
  user: UserView;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const updateMutation = useUpdateMe({
    onSuccess: () => {
      toast.success('Profile updated');
      reset(
        {
          name: getValues('name'),
          email: getValues('email'),
          password: '',
          confirmPassword: '',
        },
        { keepDirty: false },
      );
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: standardSchemaResolver(UpdateProfileFormSchema),
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      confirmPassword: '',
    });
  }, [reset, user.name, user.email]);

  const submitting = isSubmitting || updateMutation.isPending;

  const onSubmit = (values: UpdateProfileFormValues) => {
    const password = (values.password ?? '').trim();
    const confirmPassword = (values.confirmPassword ?? '').trim();

    updateMutation.mutate({
      name: values.name.trim(),
      email: values.email.trim(),
      ...(password
        ? {
            password,
            confirmPassword,
          }
        : {}),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update profile</CardTitle>
        <CardDescription>Manage your name, email, and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" disabled={submitting} {...register('name')} />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={submitting}
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              disabled={submitting}
              placeholder="Leave blank to keep current password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={submitting}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label>Active organization</Label>
            <p className="text-sm text-muted-foreground">{user.organizationName}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.dashboard)}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


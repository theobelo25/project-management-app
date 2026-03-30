'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signup } from '@web/lib/api/client';

import { SignupRequestSchema, SignupRequestDto } from '@repo/types';

import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ME_QUERY_KEY } from '@web/lib/api/queries';
import { ROUTES } from '@web/lib/routes';
import { toast } from 'sonner';

type SignUpFormProps = {
  isLoading?: boolean;
};

export default function SignUpForm({ isLoading = false }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? ROUTES.projects;

  const queryClient = useQueryClient();
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data);
      toast.success('Account created successfully!');
      router.push(callbackUrl);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account.');
    },
  });

  const onSubmit = (values: SignupRequestDto) => {
    signupMutation.mutate(values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupRequestDto>({
    resolver: standardSchemaResolver(SignupRequestSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const submitting = isSubmitting || isLoading;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      noValidate
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Theo Belo"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'signup-name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p
            id="signup-name-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="theo@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'signup-email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p
            id="signup-email-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Enter your password"
            className="pr-10"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'signup-password-error' : undefined
            }
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="signup-password-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm your password"
            className="pr-10"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword
                ? 'signup-confirm-password-error'
                : undefined
            }
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
            aria-label={
              showConfirmPassword
                ? 'Hide confirm password'
                : 'Show confirm password'
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            id="signup-confirm-password-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={submitting || signupMutation.isPending}
      >
        {submitting || signupMutation.isPending
          ? 'Creating account...'
          : 'Create account'}
      </Button>
    </form>
  );
}

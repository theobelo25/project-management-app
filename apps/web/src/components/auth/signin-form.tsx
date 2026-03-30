'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signin } from '@web/lib/api/client';

import { LoginRequestSchema, LoginRequestDto } from '@repo/types';

import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import { Label } from '@web/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ME_QUERY_KEY } from '@web/lib/api/queries';
import { toast } from 'sonner';
import { ROUTES } from '@web/lib/routes';

type SignInFormProps = {
  isLoading?: boolean;
};

export default function SignInForm({ isLoading = false }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? ROUTES.projects;

  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data);
      toast.success('Signin successful!');
      router.push(callbackUrl);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signin failed.');
    },
  });

  const onSubmit = (values: LoginRequestDto) => {
    signinMutation.mutate(values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequestDto>({
    resolver: standardSchemaResolver(LoginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="theo@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'signin-email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p
            id="signin-email-error"
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
            autoComplete="current-password"
            placeholder="Enter your password"
            className="pr-10"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? 'signin-password-error' : undefined
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
            id="signin-password-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={submitting || signinMutation.isPending}
      >
        {submitting || signinMutation.isPending ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signin } from "@web/lib/api/client";

import { LoginRequestSchema, LoginRequestDto } from "@repo/types";

import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Label } from "@web/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ME_QUERY_KEY } from "@web/lib/api/queries";

type SignUpFormProps = {
  isLoading?: boolean;
};

export default function SignInForm({ isLoading = false }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/projects";

  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, data);
      router.push(callbackUrl);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  const onSubmit = (values: LoginRequestDto) => {
    signinMutation.mutate(values);
    console.log(values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequestDto>({
    resolver: standardSchemaResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="theo@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your password"
            className="pr-10"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={submitting || signinMutation.isPending}
      >
        {submitting || signinMutation.isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}

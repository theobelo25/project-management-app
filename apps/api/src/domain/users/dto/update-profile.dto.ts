import { createZodDto } from '@api/common/zod/zod-dto.util';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]/,
    'Password must contain at least one special character',
  );

const UpdateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    email: z.email().optional(),
    password: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      passwordSchema.optional(),
    ),
    confirmPassword: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().min(8).optional(),
    ),
  })
  .superRefine((data, ctx) => {
    const hasAnyUpdate =
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined ||
      data.confirmPassword !== undefined;

    if (!hasAnyUpdate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field is required',
      });
    }

    const hasPassword = typeof data.password === 'string';
    const hasConfirm = typeof data.confirmPassword === 'string';

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

    if (hasPassword !== hasConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both password and confirmPassword are required',
        path: hasPassword ? ['confirmPassword'] : ['password'],
      });
      return;
    }

    if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}


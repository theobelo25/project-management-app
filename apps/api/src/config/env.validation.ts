import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.string().min(1),
  APP_PORT: z.coerce.number().int().positive().default(3333),
  APP_HOST: z.string().default('0.0.0.0'),
  FRONTEND_ORIGIN: z.string().min(1),
  CORS_ORIGINS: z.string().min(1),

  // Optional: set in production to share auth cookies across subdomains.
  // Example: .theocodes.dev
  COOKIE_DOMAIN: z.string().trim().min(1).optional(),

  DATASOURCE_USERNAME: z.string().min(1),
  DATASOURCE_PASSWORD: z.string().min(1),
  DATASOURCE_HOST: z.string().min(1),
  DATASOURCE_PORT: z.coerce.number().int().positive(),
  DATASOURCE_DATABASE: z.string().min(1),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRATION_MS: z.coerce.number().int().positive(),
  REFRESH_TOKEN_EXPIRATION_MS: z.coerce.number().int().positive(),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
  REALTIME_ENABLED: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = EnvSchema.safeParse(config);

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);

    const message = [
      ...flattened.formErrors,
      ...Object.entries(flattened.fieldErrors).flatMap(([key, errors]) =>
        (errors ?? []).map((err) => `${key}: ${err}`),
      ),
    ].join('\n');

    throw new Error(`Environment validation failed:\n${message}`);
  }

  return parsed.data;
}

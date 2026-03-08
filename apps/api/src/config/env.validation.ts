import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.string().min(1),
  APP_PORT: z.coerce.number().int().positive().default(3333),
  APP_HOST: z.string().default('0.0.0.0'),
  FRONTEND_ORIGIN: z.string().min(1),
  CORS_ORIGINS: z.string().min(1),

  DATASOURCE_USERNAME: z.string().min(1),
  DATASOURCE_PASSWORD: z.string().min(1),
  DATASOURCE_HOST: z.string().min(1),
  DATASOURCE_PORT: z.coerce.number().int().positive(),
  DATASOURCE_DATABASE: z.string().min(1),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_TTL: z.string().min(1),
  REFRESH_TOKEN_TTL: z.string().min(1),
  REFRESH_PREFIX_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().min(1),
  JWT_AUDIENCE: z.string().min(1),
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

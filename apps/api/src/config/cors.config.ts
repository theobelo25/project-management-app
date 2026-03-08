import { registerAs } from '@nestjs/config';

export const corsConfig = registerAs('cors', () => {
  const raw = process.env.CORS_ORIGINS;
  if (raw === null || raw === '')
    throw new Error('CORS_ORIGINS must be a non-empty string');
  return {
    origins: process.env
      .CORS_ORIGINS!.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  };
});

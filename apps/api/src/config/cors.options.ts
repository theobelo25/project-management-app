import { ConfigService } from '@nestjs/config';

export type CorsOptionsConfig = {
  origins: string[];
  credentials: true;
};

export function getCorsOptions(config: ConfigService): CorsOptionsConfig {
  const raw = config.getOrThrow<string>('CORS_ORIGINS');

  return {
    origins: raw
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    credentials: true,
  };
}

import { ConfigService } from '@nestjs/config';

export type AppOptions = {
  nodeEnv: string;
  host: string;
  port: number;
  frontendOrigin: string;
};

export function getAppOptions(config: ConfigService): AppOptions {
  return {
    nodeEnv: config.getOrThrow<string>('NODE_ENV'),
    host: config.getOrThrow<string>('APP_HOST'),
    port: config.getOrThrow<number>('APP_PORT'),
    frontendOrigin: config.getOrThrow<string>('FRONTEND_ORIGIN'),
  };
}

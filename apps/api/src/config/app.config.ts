import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV!,
  host: process.env.APP_HOST!,
  port: Number(process.env.APP_PORT),
  frontendOrigin: process.env.FRONTEND_ORIGIN!,
}));

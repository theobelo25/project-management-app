import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

import { APP_LOGGER } from './app.logger.interface';
import { PinoAppLoggerAdapter } from './pino-app-logger.apapter';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
        const isProd = nodeEnv === 'production';

        const level = config.get<string>('LOG_LEVEL') ?? 'info';

        return {
          pinoHttp: {
            level,

            // Correlation id: respect inbound header; otherwise generate.
            genReqId: (req, res) => {
              const header = req.headers['x-request-id'];
              const rawId =
                (Array.isArray(header) ? header[0] : header) ??
                req.id ??
                randomUUID();
              const requestId = String(rawId);
              res.setHeader('x-request-id', requestId);
              return requestId;
            },

            // Add standard properties to every log line
            customProps: (req) => ({
              requestId: req.id,
            }),

            // Avoid logging secrets / huge payloads
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.headers.set-cookie',
                'req.cookies',
                'req.body.password',
                'req.body.refreshToken',
                'req.body.accessToken',
                'res.headers["set-cookie"]',
              ],
              censor: '[REDACTED]',
            },

            // Optional: quieter health checks
            autoLogging: {
              ignore: (req) => {
                const url = req.url ?? '';
                return url === '/api/health' || url.startsWith('/api/health/');
              },
            },

            // Pretty logs locally only
            transport: !isProd
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                }
              : undefined,
          },
        };
      },
    }),
  ],
  providers: [
    PinoAppLoggerAdapter,
    { provide: APP_LOGGER, useExisting: PinoAppLoggerAdapter },
  ],
  exports: [PinoLoggerModule, APP_LOGGER],
})
export class LoggerModule {}

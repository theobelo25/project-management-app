import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ZodValidationPipe } from './common';
import { getCorsOptions } from './config';
import { getAppOptions } from './config/app.options';
import { Logger as PinoNestLogger } from 'nestjs-pino';
import { json, urlencoded } from 'express';
import { COOKIE } from '@repo/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(PinoNestLogger));

  // Payload limits (tune per product needs)
  app.use(json({ limit: '512kb' }));
  app.use(urlencoded({ extended: true, limit: '512kb' }));

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const appOpts = getAppOptions(configService);
  const cors = getCorsOptions(configService);

  app.enableCors({
    origin: cors.origins,
    credentials: cors.credentials,
  });

  // Swagger/OpenAPI (optional in production)
  if (appOpts.nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Project Management API')
      .setDescription('OpenAPI documentation')
      .setVersion('1.0')
      // Your JWTs are stored in cookies:
      // - access token cookie: COOKIE.AUTHENTICATION
      // - refresh token cookie: COOKIE.REFRESH
      .addCookieAuth(
        COOKIE.AUTHENTICATION,
        {
          type: 'apiKey',
          in: 'cookie',
          name: COOKIE.AUTHENTICATION,
          description:
            'JWT access token stored in the `Authentication` cookie.',
        },
        'Authentication',
      )
      .addCookieAuth(
        COOKIE.REFRESH,
        {
          type: 'apiKey',
          in: 'cookie',
          name: COOKIE.REFRESH,
          description:
            'JWT refresh token stored in the `Refresh` cookie (used for /api/auth/refresh).',
        },
        'Refresh',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document));
  }

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(app.get(AppExceptionFilter));

  await app.listen(appOpts.port, appOpts.host);
}
void bootstrap();

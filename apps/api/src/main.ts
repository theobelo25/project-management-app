import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ZodValidationPipe } from './common';
import { getCorsOptions } from './config';
import { getAppOptions } from './config/app.options';
import { Logger as PinoNestLogger } from 'nestjs-pino';
import { json, urlencoded } from 'express';

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
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(app.get(AppExceptionFilter));

  await app.listen(appOpts.port, appOpts.host);
}
bootstrap();

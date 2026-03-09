import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ZodValidationPipe } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string[]>('cors.origins'),
    credentials: configService.get<boolean>('cors.credentials'),
  });

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AppExceptionFilter());

  const port = configService.get<number>('app.port', 3333);
  const host = configService.get<string>('app.host', '0.0.0.0');

  await app.listen(port, host);
}
bootstrap();

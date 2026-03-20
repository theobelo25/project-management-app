import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { getRequestCorrelationId } from '../utils/http.utils';
import { normalizeException } from '../errors/normalize-exception';
import { buildApiErrorResponse } from '../errors/build-api-error-response';
import { APP_LOGGER, AppLogger } from '@api/logger/app.logger.interface';

@Catch()
@Injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) {
    this.logger.setContext(AppExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const normalized = normalizeException(exception);
    const payload = buildApiErrorResponse({
      ...normalized,
      path: request.url,
    });

    this.logger.error(
      {
        requestId: getRequestCorrelationId(request),
      },
      `${payload.statusCode} ${payload.message}`,
    );

    response.status(payload.statusCode).json(payload);
  }
}

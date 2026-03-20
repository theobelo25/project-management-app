import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import type { AppLogger, LogMessage } from './app.logger.interface';
import type { LogMetaBase } from '@repo/types';

@Injectable()
export class PinoAppLoggerAdapter implements AppLogger {
  constructor(private readonly pino: PinoLogger) {}

  setContext(context: string): void {
    this.pino.setContext(context);
  }

  debug(metaOrMsg: LogMetaBase | LogMessage, msg?: LogMessage): void {
    if (typeof metaOrMsg === 'string') return this.pino.debug(metaOrMsg);
    return this.pino.debug(metaOrMsg, msg ?? '');
  }

  info(metaOrMsg: LogMetaBase | LogMessage, msg?: LogMessage): void {
    if (typeof metaOrMsg === 'string') return this.pino.info(metaOrMsg);
    return this.pino.info(metaOrMsg, msg ?? '');
  }

  warn(metaOrMsg: LogMetaBase | LogMessage, msg?: LogMessage): void {
    if (typeof metaOrMsg === 'string') return this.pino.warn(metaOrMsg);
    return this.pino.warn(metaOrMsg, msg ?? '');
  }

  error(metaOrMsg: LogMetaBase | LogMessage, msg?: LogMessage): void {
    if (typeof metaOrMsg === 'string') return this.pino.error(metaOrMsg);
    return this.pino.error(metaOrMsg, msg ?? '');
  }
}

import type { LogMetaBase } from '@repo/types';

export type LogMessage = string;

export interface AppLogger {
  setContext(context: string): void;

  debug(meta: LogMetaBase, message: LogMessage): void;
  debug(message: LogMessage): void;

  info(meta: LogMetaBase, message: LogMessage): void;
  info(message: LogMessage): void;

  warn(meta: LogMetaBase, message: LogMessage): void;
  warn(message: LogMessage): void;

  error(meta: LogMetaBase, message: LogMessage): void;
  error(message: LogMessage): void;
}

export const APP_LOGGER = Symbol('APP_LOGGER');

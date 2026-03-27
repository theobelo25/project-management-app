import { isRecord } from '../utils/type-guards';

export type ExtractedErrorDetails = {
  message?: string;
  validationMessages?: string[];
  error?: string;
  details?: unknown;
  errors?: unknown;
} | null;

export function extractHttpExceptionPayload(
  exceptionResponse: unknown,
): ExtractedErrorDetails {
  if (typeof exceptionResponse === 'string') {
    return { message: exceptionResponse };
  }
  if (isRecord(exceptionResponse)) {
    const msg = exceptionResponse.message;
    let message: string | undefined;
    let validationMessages: string[] | undefined;

    if (typeof msg === 'string') {
      message = msg;
    } else if (Array.isArray(msg) && msg.every((m) => typeof m === 'string')) {
      validationMessages = msg;
    }

    return {
      message,
      validationMessages,
      error:
        typeof exceptionResponse.error === 'string'
          ? exceptionResponse.error
          : undefined,
      details: exceptionResponse.details,
      errors: exceptionResponse.errors,
    };
  }
  return null;
}

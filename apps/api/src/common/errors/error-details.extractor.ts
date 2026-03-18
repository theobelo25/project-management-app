export type ExtractedErrorDetails = {
  message?: string;
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
  if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
    const res = exceptionResponse as Record<string, unknown>;
    return {
      message: typeof res.message === 'string' ? res.message : undefined,
      error: typeof res.error === 'string' ? res.error : undefined,
      details: res.details,
      errors: res.errors,
    };
  }
  return null;
}

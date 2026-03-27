import type { IncomingMessage } from 'node:http';

/** Correlation id from pino-http (`genReqId`); see `src/types/http-incoming-message.d.ts`. */
export function getRequestCorrelationId(
  req: IncomingMessage,
): string | undefined {
  const id = req.id;
  return id === undefined ? undefined : String(id);
}

export function getSingleParam(
  param: string | string[] | undefined,
): string | null {
  if (!param || Array.isArray(param)) return null;
  return param;
}

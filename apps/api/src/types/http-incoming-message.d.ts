/**
 * pino-http assigns a correlation id to each request (`genReqId`); it lives on
 * the Node request object before Express wraps it.
 */
declare module 'node:http' {
  interface IncomingMessage {
    id?: string;
  }
}

export type ValidationErrorDetail = {
  path: string;
  message: string;
  code: string;
};

export type ApiErrorResponse<TDetails = unknown> = {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: TDetails;
};

import httpStatus from './httpStatus';

export class HttpError extends Error {
  statusCode: number;
  message: string;
  errors: Record<string, unknown>[] | null;

  constructor(
    statusCode: number,
    message?: string,
    errors?: Record<string, unknown>[] | null,
    ...params: any[]
  ) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.message = message || httpStatus[statusCode].toString();
    this.statusCode =
      statusCode || (message && Number(httpStatus[message])) || 500;
    if (this.statusCode === 500) {
      this.message = this.message
        .replace(/\./g, '')
        .concat(`, please contact support.`);
    }
    this.errors = errors || null;
  }
}

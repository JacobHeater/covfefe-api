import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export class HttpStatusError extends Error {
  constructor(message: string, statusCode?: number, innerError?: Error) {
    super(message);

    this.statusCode = statusCode || INTERNAL_SERVER_ERROR;
    this.innerError = innerError;
  }

  statusCode?: number;
  innerError?: Error;
}

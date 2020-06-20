import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export class HttpStatusError extends Error {
  constructor(message: string, statusCode = INTERNAL_SERVER_ERROR) {
    super(message);

    this.statusCode = statusCode;
  }

  statusCode?: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Environment } from '@app/env';
import { HttpStatusError } from '@app/errors/http/http-status-error';

export function covfefeErrorHandler(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  let statusCode = INTERNAL_SERVER_ERROR;

  if (error instanceof HttpStatusError) {
    statusCode = (error as HttpStatusError).statusCode || INTERNAL_SERVER_ERROR;
  }

  res.status(statusCode);
  res.send(getErrorMessageForResponse(error));

  next(error);
}

function getErrorMessageForResponse(error: Error): string {
  if (Environment.isDevelopment) {
    return JSON.stringify(error);
  }

  return error.message;
}

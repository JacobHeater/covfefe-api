import { NextFunction, Response, Request } from 'express';

export type ApiHttpHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response<unknown> | void>;
export type ApiResponse = Promise<Response<unknown> | void>;

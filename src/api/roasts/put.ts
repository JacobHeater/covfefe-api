import { OK } from 'http-status-codes';
import { Response, Request } from 'express';

export function putRoast(req: Request, res: Response): void {
  res.send(OK);
}

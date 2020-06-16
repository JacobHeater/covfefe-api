import { OK } from 'http-status-codes';
import { Response, Request } from 'express';

export function postRoast(req: Request, res: Response): void {
  res.send(OK);
}

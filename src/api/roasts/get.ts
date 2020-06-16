import { Response, Request } from 'express';
import { Roast } from '@common/models/entities/roast/roast';

export function getRoasts(req: Request, res: Response): void {
  res.send([new Roast()]);
}

export function getRoast(req: Request, res: Response): void {
  res.send(new Roast());
}

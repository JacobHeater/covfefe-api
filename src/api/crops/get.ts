import { Request, Response } from 'express';
import { Crop } from '@common/models/entities/crop/crop';

export function getCrops(req: Request, res: Response): void {
  res.send([new Crop()]);
}

export function getCrop(req: Request, res: Response): void {
  res.send(new Crop());
}

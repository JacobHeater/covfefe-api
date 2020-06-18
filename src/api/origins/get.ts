import { Request, Response } from "express";
import { Origin } from "@common/models/entities/origin/origin";

export function getOrigins(req: Request, res: Response): void {
  res.send([new Origin()]);
}

export function getOrigin(req: Request, res: Response): void {
  res.send(new Origin());
}

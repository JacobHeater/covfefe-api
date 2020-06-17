import { Request, Response } from "express";
import { OK } from "http-status-codes";

export function deleteCrop(req: Request, res: Response): void {
  res.send(OK);
}

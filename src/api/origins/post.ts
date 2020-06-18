import { Request, Response } from "express";
import { OK } from "http-status-codes";

export function postOrigin(req: Request, res: Response): void {
  res.send(OK);
}

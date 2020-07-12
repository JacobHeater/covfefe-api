import { IRoute, IRouteComponent } from "./types";
import express, { Router, Response } from "express";
import { OK } from "http-status-codes";

export abstract class RouteBase implements IRoute {
  constructor() {
    this.router.get('/heartbeat', (_, res: Response) => res.sendStatus(OK));
  }
  protected readonly router: Router = express.Router();
  abstract exposeRoute(): IRouteComponent;
}
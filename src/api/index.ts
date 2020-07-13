import express, { Response, Request } from 'express';
import { RoastsRoute } from './roasts';
import { OriginsRoute } from './origins';
import { DocsRoute } from './docs';
import { CropsRoute } from './crops';
import { IRouteComponent } from './types';
import { UsersRoute } from './users';
import { RolesRoute } from './roles';
import { OK } from 'http-status-codes';

export const heartbeatRoute = '/heartbeat';

/**
 * Initializes the /api Router and compiles
 * all of the routes into this route as
 * sub-routes.
 */
export function initializeApiRouter(): IRouteComponent {
  const apiRouter = express.Router();
  const routes = [
    new RoastsRoute(),
    new OriginsRoute(),
    new DocsRoute(),
    new CropsRoute(),
    new UsersRoute(),
    new RolesRoute(),
  ].map((r) => r.exposeRoute());

  for (const route of routes) {
    const [path, router] = route;

    apiRouter.use(path, router);
  }

  apiRouter.get(heartbeatRoute, answerHeartbeat);

  return ['/api', apiRouter];
}

function answerHeartbeat(_: Request, res: Response) {
  return res.sendStatus(OK);
}

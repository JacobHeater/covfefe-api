import express from 'express';
import { roastsRoute } from './roasts';
import { originsRoute } from './origins';
import { docsRoute } from './docs';
import { IRouteComponent } from './iroute';

/**
 * Initializes the /api Router and compiles
 * all of the routes into this route as
 * sub-routes.
 */
export function initializeApiRouter(): IRouteComponent {
  const apiRouter = express.Router();
  const routes = [roastsRoute, originsRoute, docsRoute].map((r) =>
    r.exposeRoute(),
  );

  for (const route of routes) {
    const [path, router] = route;

    apiRouter.use(path, router);
  }

  return ['/api', apiRouter];
}

import express, { Express } from 'express';
import { roastsRoute } from './roasts';
import { originsRoute } from './origins';
import { docsRoute } from './docs';

const apiRouter = express.Router();
let isInitialized = false;

export function initializeApi(app: Express): void {
  if (isInitialized) return;

  const routes = [
    roastsRoute.exposeRoute(),
    originsRoute.exposeRoute(),
    docsRoute.exposeRoute()
  ];

  for (const route of routes) {
    const [path, router] = route;

    apiRouter.use(path, router);
  }

  app.use('/api', apiRouter);
  isInitialized = true;
}

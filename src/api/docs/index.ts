import { IRoute, IRouteComponent } from "../iroute";
import express from "express";
import { appContext } from '@domain';
import * as swagger from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs-extra';

export const docsRoute: IRoute = {
  exposeRoute(): IRouteComponent {
    const router = express.Router();
    const swaggerPath = path.join(appContext.baseDir, 'swagger.json');
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath).toString());

    router.use('/', swagger.serve, swagger.setup({ swaggerDocument }));

    return ['/docs', router];
  }
};

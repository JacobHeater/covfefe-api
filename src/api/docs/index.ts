import { IRoute } from "../iroute";
import express, { Router } from "express";
import * as swagger from 'swagger-ui-express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('@appcontext/swagger.json');

export const docsRoute: IRoute = {
  exposeRoute(): [string, Router] {
    const router = express.Router();

    router.use('/', swagger.serve, swagger.setup(swaggerDocument));

    return ['/docs', router];
  }
};

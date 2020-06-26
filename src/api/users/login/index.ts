import * as express from 'express';
import { IRoute, IRouteComponent } from "@app/api/types";
import { postLogin } from './post';

export const loginRoute: IRoute = {
  exposeRoute(): IRouteComponent {
    const router = express.Router();

    router.post('/', postLogin);

    return ['/login', router];
  }
};

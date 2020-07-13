import * as express from 'express';
import { IRouteComponent } from '../types';
import { postRole } from './post';
import { putRole } from './put';
import { deleteRole } from './delete';
import { getRoles, getRole } from './get';
import { OK } from 'http-status-codes';
import { RouteBase } from '../route-base';

export class RolesRoute extends RouteBase {
  exposeRoute(): IRouteComponent {
    const router = this.router;

    router.get('/heartbeat', (_, res: express.Response) =>
      res.sendStatus(OK),
    );
    router.get('/', getRoles);
    router.get('/:id', getRole);
    router.post('/', postRole);
    router.put('/:id', putRole);
    router.delete('/:id', deleteRole);

    return ['/roles', router];
  }
}

import { IRouteComponent } from '../types';
import { getRoasts, getRoast } from './get';
import { putRoast } from './put';
import { postRoast } from './post';
import { deleteRoast } from './delete';
import { RouteBase } from '../route-base';

export class RoastsRoute extends RouteBase {
  exposeRoute(): IRouteComponent {
    const router = this.router;

    router.get('/', getRoasts);
    router.get('/:id', getRoast);
    router.post('/', postRoast);
    router.put('/:id', putRoast);
    router.delete('/:id', deleteRoast);

    return ['/roasts', router];
  }
}

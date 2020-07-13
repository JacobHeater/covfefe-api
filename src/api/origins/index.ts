import { IRouteComponent } from '../types';
import { getOrigin, getOrigins } from './get';
import { putOrigin } from './put';
import { postOrigin } from './post';
import { deleteOrigin } from './delete';
import { RouteBase } from '../route-base';

export class OriginsRoute extends RouteBase {
  exposeRoute(): IRouteComponent {
    const router = this.router;

    router.get('/', getOrigins);
    router.get('/:id', getOrigin);
    router.post('/', postOrigin);
    router.put('/:id', putOrigin);
    router.delete('/:id', deleteOrigin);

    return ['/origins', router];
  }
}

import { IRouteComponent } from '../types';
import { getCrops, getCrop } from './get';
import { putCrop } from './put';
import { deleteCrop } from './delete';
import { postCrop } from './post';
import { RouteBase } from '../route-base';

export class CropsRoute extends RouteBase {
  exposeRoute(): IRouteComponent {
    const router = this.router;

    router.get('/', getCrops);
    router.get('/:id', getCrop);
    router.post('/', postCrop);
    router.put('/:id', putCrop);
    router.delete('/:id', deleteCrop);

    return ['/crops', router];
  }
}

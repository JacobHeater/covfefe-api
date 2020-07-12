import { IRouteComponent } from '../types';
import { appContext } from '@domain';
import * as swagger from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs-extra';
import { RouteBase } from '../route-base';

export class DocsRoute extends RouteBase {
  exposeRoute(): IRouteComponent {
    const router = this.router;
    const swaggerPath = path.join(appContext.baseDir, 'swagger.json');
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath).toString());

    router.use('/', swagger.serve);
    router.get('/', swagger.setup(swaggerDocument));

    return ['/docs', router];
  }
}

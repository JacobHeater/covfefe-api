import { IRouteComponent } from '../types';
import { postUser } from './post';
import { putUser } from './put';
import { getUser, getUsers } from './get';
import { deleteUser } from './delete';
import { loginRoute } from './login';
import { RouteBase } from '../route-base';

export class UsersRoute extends RouteBase {
  exposeRoute(): IRouteComponent {
    const router = this.router;

    router.get('/', getUsers);
    router.get('/:id', getUser);
    router.post('/', postUser);
    router.put('/:id', putUser);
    router.delete('/:id', deleteUser);

    const [loginPath, loginRouter] = loginRoute.exposeRoute();

    router.use(loginPath, loginRouter);

    return ['/users', router];
  }
}

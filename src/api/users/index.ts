import * as express from 'express';
import { IRoute, IRouteComponent } from '../types';
import { postUser } from './post';
import { putUser } from './put';
import { getUser, getUsers } from './get';
import { deleteUser } from './delete';
import { loginRoute } from './login';

export const usersRoute: IRoute = {
  exposeRoute(): IRouteComponent {
    const router = express.Router();

    router.get('/', getUsers);
    router.get('/:id', getUser);
    router.post('/', postUser);
    router.put('/:id', putUser);
    router.delete('/:id', deleteUser);

    const [loginPath, loginRouter] = loginRoute.exposeRoute();

    router.use(loginPath, loginRouter);

    return ['/users', router];
  }
};

import { createPutHandler } from '../entity-base-routes/put';
import { RoleRepository } from '@app/repository/mongo/role/role-repository';

export const putRole = createPutHandler(RoleRepository);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from '@common/models/entities/user/user';
import { UserRepository } from './user-repository';
import { IMongoEntityRepository } from '../entities/imongo-entity-repository';

const UserRepositorySecurityFactory = (ctor: {
  new (...args: any[]): UserRepository;
}) =>
  class UserRepositorySecurity extends ctor
    implements IMongoEntityRepository<User> {
    constructor(...args: any[]) {
      super(...args);
    }

    findAsync(filter: User | { [key: string]: unknown }): Promise<User[]> {
      return super.findAsync(filter);
    }

    findOneAsync(filter: User | { [key: string]: unknown }): Promise<User> {
      return super.findOneAsync(filter);
    }

    findAllAsync(): Promise<User[]> {
      return super.findAllAsync();
    }

    findOneByIdAsync(id: string): Promise<User> {
      return super.findOneByIdAsync(id);
    }

    insertOneAsync(entity: User): Promise<string> {
      return super.insertOneAsync(entity);
    }

    insertManyAsync(entities: User[]): Promise<string[]> {
      return super.insertManyAsync(entities);
    }

    updateOneAsync(
      id: string,
      entity: User | { [key: string]: unknown },
    ): Promise<boolean> {
      return super.updateOneAsync(id, entity);
    }

    updateManyAsync(
      filter: User | { [key: string]: unknown },
      entity: User | { [key: string]: unknown },
    ): Promise<boolean> {
      return super.updateManyAsync(filter, entity);
    }

    deleteOneAsync(id: string): Promise<boolean> {
      return super.deleteOneAsync(id);
    }

    deleteManyAsync(
      filter: User | { [key: string]: unknown },
    ): Promise<boolean> {
      return super.deleteManyAsync(filter);
    }
  };

export const SecuredRepository = () => UserRepositorySecurityFactory;

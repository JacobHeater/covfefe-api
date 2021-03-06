import { IHaveUserReference } from '@common/models/entities/user/ihave-user-reference';
import { Entity } from '@common/models/entities/entity';
import { EntityRepositoryReferencePopulatorBase } from '../entities/references/entity-repository-reference-populator-base';
import { User } from '@common/models/entities/user/user';
import { Lazy } from '@common/lazy';
import { UserRepository } from './user-repository';
import { DbRequestContext } from '@app/database/db-request-context';

export class EntityUserReferencePopulator<
  TEntity extends Entity & IHaveUserReference
> extends EntityRepositoryReferencePopulatorBase<TEntity, User> {
  constructor(context: DbRequestContext) {
    super(new Lazy<UserRepository>(() => new UserRepository(context)));
  }

  protected getReferenceId(entity: TEntity): string {
    return entity.user.id;
  }

  protected setReferenceObject(entity: TEntity, ref: User): void {
    Object.assign(entity.user, {
      ...ref,
    });
  }
}

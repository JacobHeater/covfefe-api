import { EntityRepositoryManyReferencesPopulatorBase } from '../entities/references/entity-repository-reference-populator-base';
import { Role } from '@common/models/entities/roles/role';
import { User } from '@common/models/entities/user/user';
import { Lazy } from '@common/lazy';
import { RoleRepository } from '../role/role-repository';
import { DbRequestContext } from '@app/database/db-request-context';

export class UserRolesReferencePopulator extends EntityRepositoryManyReferencesPopulatorBase<
  User,
  Role
> {
  constructor(context: DbRequestContext) {
    super(new Lazy<RoleRepository>(() => new RoleRepository(context)));
  }
  
  protected getReferenceIds(entity: User): string[] {
    return (entity.roles || []).map(r => r.id);
  }

  protected setReferenceObject(entity: User, ref: Role[]): void {
    entity.roles = ref;
  }
}

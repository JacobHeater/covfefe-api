import { Role } from '@common/models/entities/roles/role';
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { EntityRepositoryBase } from '../entities/entity-repository-base';
import { CollectionPermissionRepository } from '../permissions/collection-permission-repository';
import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';
import { DbRequestContext } from '@app/database/db-request-context';

export class RoleRepository extends EntityRepositoryBase<Role> {
  constructor(context: DbRequestContext) {
    super(context);

    this._collPermsRepo = new CollectionPermissionRepository(context);
  }

  readonly collectionName = Role.collectionName;

  protected references: IEntityRepositoryReferencePopulator[];
  protected readonly factory: new () => Role = Role;

  async findAllRolesInNames(names: string[]): Promise<Role[]> {
    return await this.findAsync({
      name: {
        $in: names
      }
    });
  }

  private readonly _collPermsRepo: CollectionPermissionRepository;

  protected fetchCollectionPermissionsAsync(): Promise<CollectionPermission[]> {
    return this._collPermsRepo.findByCollectionNameAsync(this.collectionName);
  }
}

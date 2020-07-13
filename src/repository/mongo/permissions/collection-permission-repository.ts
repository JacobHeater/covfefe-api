import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';
import { EntityRepositoryBase } from '../entities/entity-repository-base';
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';

export class CollectionPermissionRepository extends EntityRepositoryBase<
  CollectionPermission
> {
  collectionName: string = CollectionPermission.name;
  protected references: IEntityRepositoryReferencePopulator[] = null;
  protected factory: new () => CollectionPermission = CollectionPermission;

  protected get isExemptFromCollectionPermissions(): boolean {
    return true;
  }

  findByCollectionNameAsync(collectionName: string): Promise<CollectionPermission[]> {
    return this.findAsync({ collectionName });
  }
}

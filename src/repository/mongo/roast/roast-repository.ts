import { EntityRepositoryBase } from '../entities/entity-repository-base';
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { Roast } from '@common/models/entities/roast/roast';
import { RoastCropReferencePopulator } from './roast-crop-reference-populator';
import { EntityUserReferencePopulator } from '../users/entity-user-reference-populator';
import { DbRequestContext } from '@app/database/db-request-context';
import { CollectionPermissionRepository } from '../permissions/collection-permission-repository';
import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';

export class RoastRepository extends EntityRepositoryBase<Roast> {
  constructor(context: DbRequestContext) {
    super(context);

    this._collPermsRepo = new CollectionPermissionRepository(context);

    this.references = [
      new RoastCropReferencePopulator(context),
      new EntityUserReferencePopulator<Roast>(context)
    ];
  }
  
  readonly collectionName = Roast.collectionName;
  
  protected references: IEntityRepositoryReferencePopulator[];
  protected readonly factory: new () => Roast = Roast;

  private readonly _collPermsRepo: CollectionPermissionRepository;

  protected fetchCollectionPermissionsAsync(): Promise<CollectionPermission[]> {
    return this._collPermsRepo.findByCollectionNameAsync(this.collectionName);
  }
}

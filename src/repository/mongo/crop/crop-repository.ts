import { Crop } from '@common/models/entities/crop/crop';
import { EntityRepositoryBase } from '../entities/entity-repository-base';
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { CropOriginReferencePopulator } from './crop-origin-reference-populator';
import { EntityUserReferencePopulator } from '../users/entity-user-reference-populator';
import { DbRequestContext } from '@app/database/db-request-context';
import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';
import { CollectionPermissionRepository } from '../permissions/collection-permission-repository';

export class CropRepository extends EntityRepositoryBase<Crop> {
  constructor(context: DbRequestContext) {
    super(context);

    this._collPermsRepo = new CollectionPermissionRepository(context);

    this.references = [
      new CropOriginReferencePopulator(context),
      new EntityUserReferencePopulator<Crop>(context)
    ];
  }
  
  readonly collectionName = Crop.collectionName;

  protected references: IEntityRepositoryReferencePopulator[];
  protected readonly factory: new () => Crop = Crop;

  private readonly _collPermsRepo: CollectionPermissionRepository;

  protected fetchCollectionPermissionsAsync(): Promise<CollectionPermission[]> {
    return this._collPermsRepo.findByCollectionNameAsync(this.collectionName);
  }
}

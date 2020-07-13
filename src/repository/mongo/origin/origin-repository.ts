import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { Origin } from "@common/models/entities/origin/origin";
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { EntityUserReferencePopulator } from "../users/entity-user-reference-populator";
import { DbRequestContext } from "@app/database/db-request-context";
import { CollectionPermissionRepository } from "../permissions/collection-permission-repository";
import { CollectionPermission } from "@common/models/entities/permissions/collection-permission";

export class OriginRepository extends EntityRepositoryBase<Origin> {
  constructor(context: DbRequestContext) {
    super(context);

    this._collPermsRepo = new CollectionPermissionRepository(context);

    this.references = [
      new EntityUserReferencePopulator<Origin>(context)
    ];
  }
  
  readonly collectionName = Origin.collectionName;
  
  protected references: IEntityRepositoryReferencePopulator[] = null;
  protected readonly factory: new () => Origin = Origin;

  private readonly _collPermsRepo: CollectionPermissionRepository;

  protected fetchCollectionPermissionsAsync(): Promise<CollectionPermission[]> {
    return this._collPermsRepo.findByCollectionNameAsync(this.collectionName);
  }
}

import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { DatabaseInitialization } from "@common/models/entities/application/database-initialization";
import { IEntityRepositoryReferencePopulator } from "../entities/references/ientity-repository-reference-populator";

export class DatabaseInitializationRepository extends EntityRepositoryBase<DatabaseInitialization> {
  readonly collectionName: string = DatabaseInitialization.collectionName;
  protected references: IEntityRepositoryReferencePopulator[] = null;
  protected factory: new () => DatabaseInitialization = DatabaseInitialization;

  get isExemptFromCollectionPermissions(): boolean {
    return true;
  }
}
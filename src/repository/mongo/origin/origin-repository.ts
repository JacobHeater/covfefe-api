import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { Origin } from "@common/models/entities/origin/origin";
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { Db } from "mongodb";
import { EntityUserReferencePopulator } from "../users/entity-user-reference-populator";

export class OriginRepository extends EntityRepositoryBase<Origin> {
  constructor(db: Db) {
    super(db);

    this.references = [
      new EntityUserReferencePopulator<Origin>(db)
    ];
  }
  protected references: IEntityRepositoryReferencePopulator<Origin>[] = null;
  protected readonly collectionName = Origin.collectionName;
  protected readonly factory: new () => Origin = Origin;
}

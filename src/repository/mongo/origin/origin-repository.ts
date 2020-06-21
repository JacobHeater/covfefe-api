import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { Origin } from "@common/models/entities/origin/origin";

export class OriginRepository extends EntityRepositoryBase<Origin> {
  protected readonly collectionName = Origin.collectionName;
  protected readonly factory: new () => Origin = Origin;
}

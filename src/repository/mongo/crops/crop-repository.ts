import { Crop } from "@common/models/entities/crop/crop";
import { EntityRepositoryBase } from "../entities/entity-repository-base";

export class CropRepository extends EntityRepositoryBase<Crop> {
  protected get collectionName(): string {
    return 'Crops';
  }
  protected get factory(): new () => Crop {
    return Crop;
  }
}

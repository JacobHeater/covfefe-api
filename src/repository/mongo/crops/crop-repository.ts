import { Crop } from "@common/models/entities/crop/crop";
import { EntityRepositoryBase } from "../entities/entity-repository-base";

export class CropRepository extends EntityRepositoryBase<Crop> {
  protected factory: new () => Crop = Crop;
  protected readonly collectionName = 'Crop';
}

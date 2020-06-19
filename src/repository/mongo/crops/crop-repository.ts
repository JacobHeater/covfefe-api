import { Crop } from "@common/models/entities/crop/crop";
import { EntityRepositoryBase } from "../entities/entity-repository-base";

export class CropRepository extends EntityRepositoryBase<Crop> {
  protected readonly collectionName: string = 'Crops';
  protected readonly factory: new () => Crop = Crop;
}

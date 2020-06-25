import { EntityRepositoryReferencePopulatorBase } from "../entities/references/entity-repository-reference-populator-base";
import { Roast } from "@common/models/entities/roast/roast";
import { Crop } from "@common/models/entities/crop/crop";
import { CropRepository } from "../crop/crop-repository";
import { Lazy } from "@common/lazy";
import { Db } from "mongodb";

export class RoastCropReferencePopulator extends EntityRepositoryReferencePopulatorBase<
  Roast,
  Crop
> {
  constructor(db: Db) {
    super(new Lazy<CropRepository>(() => new CropRepository(db)));
  }

  protected getReferenceId(entity: Roast): string {
    return entity.crop.id;
  }

  protected setReferenceObject(entity: Roast, ref: Crop): void {
    Object.assign(entity.crop, {
      ...ref
    });
  }
}
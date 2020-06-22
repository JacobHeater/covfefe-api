import { Crop } from '@common/models/entities/crop/crop';
import { EntityRepositoryBase } from '../entities/entity-repository-base';
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { Db } from 'mongodb';
import { CropOriginReferencePopulator } from './crop-origin-reference-populator';

export class CropRepository extends EntityRepositoryBase<Crop> {
  constructor(db: Db) {
    super(db);

    this.references = [
      new CropOriginReferencePopulator(db)
    ];
  }
  protected references: IEntityRepositoryReferencePopulator<Crop>[];
  protected readonly collectionName = Crop.collectionName;
  protected readonly factory: new () => Crop = Crop;
}

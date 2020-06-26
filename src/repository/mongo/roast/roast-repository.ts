import { EntityRepositoryBase } from '../entities/entity-repository-base';
import { IEntityRepositoryReferencePopulator } from '../entities/references/ientity-repository-reference-populator';
import { Db } from 'mongodb';
import { Roast } from '@common/models/entities/roast/roast';
import { RoastCropReferencePopulator } from './roast-crop-reference-populator';
import { EntityUserReferencePopulator } from '../users/entity-user-reference-populator';

export class RoastRepository extends EntityRepositoryBase<Roast> {
  constructor(db: Db) {
    super(db);

    this.references = [
      new RoastCropReferencePopulator(db),
      new EntityUserReferencePopulator<Roast>(db)
    ];
  }
  protected references: IEntityRepositoryReferencePopulator<Roast>[];
  protected readonly collectionName = Roast.collectionName;
  protected readonly factory: new () => Roast = Roast;
}


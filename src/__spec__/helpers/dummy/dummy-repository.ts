import { EntityRepositoryBase } from '@app/repository/mongo/entities/entity-repository-base';
import { IEntityRepositoryReferencePopulator } from '../../../repository/mongo/entities/references/ientity-repository-reference-populator';
import { DummyModel } from './models/dummy-model';

export class DummyRepository extends EntityRepositoryBase<DummyModel> {
  readonly collectionName: string = 'Dummies';
  
  protected references: IEntityRepositoryReferencePopulator[] = null;
  protected readonly factory: new () => DummyModel = DummyModel;
}

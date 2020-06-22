import { EntityRepositoryBase } from "@app/repository/mongo/entities/entity-repository-base";
import { IEntityRepositoryReferencePopulator } from '../../../repository/mongo/entities/references/ientity-repository-reference-populator';
import { DummyModel } from "./models/dummy-model";

export class DummyRepository extends EntityRepositoryBase<DummyModel> {
  protected references: IEntityRepositoryReferencePopulator<DummyModel>[] = null;
  protected readonly collectionName: string = "Dummies";
  protected readonly factory: new () => DummyModel = DummyModel;
}
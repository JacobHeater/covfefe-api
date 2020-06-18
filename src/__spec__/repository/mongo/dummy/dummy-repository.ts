import { EntityRepositoryBase } from "@app/repository/mongo/entities/entity-repository-base";
import { DummyModel } from "./models/dummy-model";

export class DummyRepository extends EntityRepositoryBase<DummyModel> {
  protected get collectionName(): string {
    return 'Dummy';
  }
  protected get factory(): new () => DummyModel {
    return DummyModel;
  }
}
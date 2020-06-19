import { EntityRepositoryBase } from "@app/repository/mongo/entities/entity-repository-base";
import { DummyModel } from "./models/dummy-model";

export class DummyRepository extends EntityRepositoryBase<DummyModel> {
  protected readonly collectionName: string = "Dummies";
  protected readonly factory: new () => DummyModel = DummyModel;
}
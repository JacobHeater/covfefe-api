import { Db } from "mongodb";
import { User } from '@common/models/entities/user/user';
import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { IEntityRepositoryReferencePopulator } from "../entities/references/ientity-repository-reference-populator";

export class UserRepository extends EntityRepositoryBase<User> {
  constructor(db: Db) {
    super(db);

    this.references = [];
  }
  protected references: IEntityRepositoryReferencePopulator<User>[];
  protected readonly collectionName = User.collectionName;
  protected readonly factory: new () => User = User;
}

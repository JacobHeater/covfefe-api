import { Db } from "mongodb";
import { User } from '@common/models/entities/user/user';
import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { IEntityRepositoryReferencePopulator } from "../entities/references/ientity-repository-reference-populator";
import { SecuredRepository } from "./user-repository-security";

@SecuredRepository()
export class UserRepository extends EntityRepositoryBase<User> {
  constructor(db: Db) {
    super(db);

    this.references = [];
    this.processors = [
      this.cleanUserNameFromUser
    ];
  }
  
  protected references: IEntityRepositoryReferencePopulator<User>[];
  protected readonly collectionName = User.collectionName;
  protected readonly factory: new () => User = User;

  private cleanUserNameFromUser(entity: User): Promise<void> {
    entity.password = '';

    return Promise.resolve();
  }
}

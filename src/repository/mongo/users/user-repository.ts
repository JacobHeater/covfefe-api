import { User } from '@common/models/entities/user/user';
import { EntityRepositoryBase } from "../entities/entity-repository-base";
import { IEntityRepositoryReferencePopulator } from "../entities/references/ientity-repository-reference-populator";
import { UserRolesReferencePopulator } from "./user-roles-reference-populator";
import { DbRequestContext } from "@app/database/db-request-context";
import { CollectionPermissionRepository } from '../permissions/collection-permission-repository';
import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';

export class UserRepository extends EntityRepositoryBase<User> {
  constructor(context: DbRequestContext) {
    super(context);

    this.references = [
      new UserRolesReferencePopulator(context)
    ];
    this.findProcessors = [
      this.cleanPasswordFromUser
    ];

    this._collPermsRepo = new CollectionPermissionRepository(context);
  }
  
  readonly collectionName = User.collectionName;
  
  protected references: IEntityRepositoryReferencePopulator[];
  protected readonly factory: new () => User = User;

  private cleanPasswordFromUser(entity: User): Promise<void> {
    entity.password = '';

    return Promise.resolve();
  }

  private readonly _collPermsRepo: CollectionPermissionRepository;

  protected fetchCollectionPermissionsAsync(): Promise<CollectionPermission[]> {
    return this._collPermsRepo.findByCollectionNameAsync(this.collectionName);
  }
}

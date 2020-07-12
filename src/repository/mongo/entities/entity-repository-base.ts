import { Entity } from '@common/models/entities/entity';
import {
  IMongoEntityRepository,
  IMongoRepository,
} from './imongo-entity-repository';
import { Db, Collection, FilterQuery } from 'mongodb';
import shortid from 'shortid';
import {
  IEntityRepositoryReferencePopulator,
  ReferenceType,
  IEntityRepositorySingleReferencePopulator,
  IEntityRepositoryManyReferencesPopulator,
} from './references/ientity-repository-reference-populator';
import { logger } from '@common/logging/winston';
import { DbRequestContext } from '@app/database/db-request-context';
import { PermissionsService } from '@common/security/permissions/permissions-service';
import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';
import { PermissionAction } from '@common/security/permissions/permission';
import { IPermissionWaiver } from '@common/security/permissions/ipermission-waiver';
import { EmptyUpdateEntityError } from '@app/errors/repository/empty-update-entity-error';

const noMongoObjectId = {
  projection: {
    _id: 0,
  },
};

export abstract class EntityRepositoryBase<TModel extends Entity>
  implements IMongoEntityRepository<TModel>, IMongoRepository {
  constructor(context: DbRequestContext) {
    logger.debug(`Entering new ${EntityRepositoryBase.name}()`);
    if (!context) {
      logger.error(
        `Argument 'context' must have a value, but got ${JSON.stringify(
          context,
        )}`,
      );
      throw new Error(`Argument 'database' must have a value!`);
    }

    this.dbContext = context;
  }

  abstract readonly collectionName: string;

  protected dbContext: DbRequestContext;
  protected abstract references: IEntityRepositoryReferencePopulator[];
  protected abstract readonly factory: new () => TModel;

  protected get db(): Db {
    return this.dbContext.connection.instance;
  }

  protected get collection(): Collection {
    return this.db.collection(this.collectionName);
  }

  /**
   * Data processors that operate on the data
   * before it is returned to the caller as part
   * of all the find operations.
   *
   * @virtual
   */
  protected findProcessors: ((entity: TModel) => Promise<void>)[] = [];
  protected get isExemptFromCollectionPermissions(): boolean {
    return false;
  }
  private readonly _permissionsSvc = new PermissionsService();

  protected fetchCollectionPermissionsAsync(): Promise<CollectionPermission[]> {
    return Promise.resolve([]);
  }

  async findAsync(
    filter: TModel | { [key: string]: unknown } | FilterQuery<unknown>,
  ): Promise<TModel[]> {
    logger.debug(`Entering ${this.findAsync.name}()`);

    if (!(await this.validateCollectionPermissionsAsync(PermissionAction.read)))
      return null;

    const any = await this.collection
      .find(filter, { ...noMongoObjectId })
      .toArray();

    const entities = any.map((doc) => this.mapMongoDocumentToEntity(doc));

    for (const entity of entities) {
      await Promise.all([
        this.processReferencesAsync(entity),
        this.executeDataProcessorsAsync(entity),
      ]);
    }

    return (entities || []).filter((ent) =>
      this.validateEntityPermissions(ent, PermissionAction.read),
    );
  }

  async findOneAsync(
    filter: TModel | { [key: string]: unknown },
    skipPermissionsChecks = false,
  ): Promise<TModel> {
    logger.debug(`Entering ${this.findOneAsync.name}()`);

    const one = await this.collection.findOne(filter, {
      ...noMongoObjectId,
    });

    if (!one) {
      return null;
    }

    const entity = this.mapMongoDocumentToEntity(one);

    await Promise.all([
      this.processReferencesAsync(entity),
      this.executeDataProcessorsAsync(entity),
    ]);

    if (skipPermissionsChecks) return entity;

    return this.validateEntityPermissions(entity, PermissionAction.read)
      ? entity
      : null;
  }

  async findAllAsync(): Promise<TModel[]> {
    logger.debug(`Entering ${this.findAllAsync.name}()`);
    const all = await this.collection
      .find({}, { ...noMongoObjectId })
      .toArray();

    const entities = all.map((doc) => this.mapMongoDocumentToEntity(doc));

    for (const entity of entities) {
      await Promise.all([
        this.processReferencesAsync(entity),
        this.executeDataProcessorsAsync(entity),
      ]);
    }

    return (entities || []).filter((ent) =>
      this.validateEntityPermissions(ent, PermissionAction.read),
    );
  }

  async findOneByIdAsync(id: string): Promise<TModel> {
    logger.debug(`Entering ${this.findOneByIdAsync.name}(id: ${id})`);
    const found = await this.collection.findOne({ id }, { ...noMongoObjectId });

    if (found) {
      const entity = this.mapMongoDocumentToEntity(found);

      await Promise.all([
        this.processReferencesAsync(entity),
        this.executeDataProcessorsAsync(entity),
      ]);

      return this.validateEntityPermissions(entity, PermissionAction.read)
        ? entity
        : null;
    }

    logger.debug(`No entity was found with id ${id}`);

    return null;
  }

  async insertOneAsync(entity: TModel): Promise<string> {
    logger.debug(`Entering ${this.insertOneAsync.name}()`);
    if (!entity) {
      logger.error(`Argument 'entity' must have a value to insert.`);
      throw new Error(`Argument 'entity' must have a value to insert.`);
    }

    if (
      !(await this.validateCollectionPermissionsAsync(PermissionAction.create))
    )
      return null;

    entity.id = shortid.generate();

    const result = await this.collection.insertOne(entity);

    if (result.insertedCount === 1) {
      return entity.id;
    }

    logger.debug(
      `Something went wrong while inserting entity: ${JSON.stringify(entity)}`,
    );

    return null;
  }

  async insertManyAsync(entities: TModel[]): Promise<string[]> {
    logger.debug(`Entering ${this.insertManyAsync.name}()`);
    if (!Array.isArray(entities)) {
      logger.error(
        `Argument 'entities' must be an array to insert many but got ${JSON.stringify(
          entities,
        )}`,
      );
      throw new Error(`Argument 'entities' must be an array to insert many.`);
    }

    if (
      !(await this.validateCollectionPermissionsAsync(PermissionAction.create))
    )
      return null;

    entities.forEach((e) => (e.id = shortid.generate()));

    const result = await this.collection.insertMany(entities);

    if (result.insertedCount === entities.length) {
      return entities.map((e) => e.id);
    }

    logger.debug(
      `${entities.length - result.insertedCount} were not inserted.`,
    );

    return null;
  }

  async deleteOneAsync(id: string): Promise<boolean> {
    logger.debug(`Entering ${this.deleteOneAsync.name}(${id})`);

    if (
      !(await this.validateCollectionPermissionsAsync(
        PermissionAction.delete,
        PermissionAction.read,
      ))
    )
      return false;

    const findResult = await this.findOneByIdAsync(id);

    if (
      !findResult ||
      !this.validateEntityPermissions(findResult, PermissionAction.delete)
    )
      return false;

    const result = await this.collection.deleteOne({ id });

    return result.deletedCount === 1;
  }

  async updateOneAsync(
    id: string,
    entity: TModel | { [key: string]: unknown },
  ): Promise<boolean> {
    logger.debug(`Entering ${this.updateOneAsync.name}(${id}, entity)`);

    if (
      !this.validateCollectionPermissionsAsync(
        PermissionAction.read,
        PermissionAction.update,
      )
    )
      return false;

    const findResult = await this.findOneByIdAsync(id);

    if (
      !findResult ||
      !this.validateEntityPermissions(findResult, PermissionAction.update)
    )
      return false;

    if (Object.keys(entity).length === 0) {
      throw new EmptyUpdateEntityError(this.collectionName);
    }

    const result = await this.collection.updateOne(
      { id },
      {
        $set: {
          ...entity,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async updateManyAsync(
    filter: TModel | { [key: string]: unknown },
    entity: TModel | { [key: string]: unknown },
  ): Promise<boolean> {
    logger.debug(`Entering ${this.updateManyAsync.name}()`);

    if (
      !this.validateCollectionPermissionsAsync(
        PermissionAction.update,
        PermissionAction.read,
      )
    )
      return false;

    const findResults = await this.findAsync(filter);

    if (!Array.isArray(findResults) || findResults.length === 0) return false;

    await Promise.all(
      findResults.map((ent) => this.updateOneAsync(ent.id, entity)),
    );

    return true;
  }

  async deleteManyAsync(
    filter: { [key: string]: unknown } | TModel,
  ): Promise<boolean> {
    logger.debug(`Entering ${this.deleteManyAsync.name}(filter)`);

    if (!this.validateCollectionPermissionsAsync(PermissionAction.delete))
      return false;

    const findResults = await this.findAsync(filter);

    if (!Array.isArray(findResults) || findResults.length === 0) return false;

    await Promise.all(findResults.map((ent) => this.deleteOneAsync(ent.id)));

    return true;
  }

  async dispose(): Promise<void> {
    await this.dbContext.connection.dispose();
  }

  setPermissionWaiver(waiver: IPermissionWaiver): void {
    this.dbContext.waivePermissions = waiver;
  }

  private mapMongoDocumentToEntity(doc: unknown): TModel {
    if (!doc) {
      logger.error(
        `Could not convert mongo document to entity instance because the mongo document was undefined`,
      );
      throw new Error(`Argument 'doc' is must be an instance of an object.`);
    }

    return Object.assign(new this.factory(), doc);
  }

  private async processReferencesAsync(entity: TModel): Promise<void[]> {
    if (Array.isArray(this.references) && this.references.length > 0) {
      return Promise.all(
        this.references.map((ref) =>
          this.invokeReferencePopulator(ref, entity),
        ),
      );
    }
  }

  private async executeDataProcessorsAsync(entity: TModel): Promise<void[]> {
    if (Array.isArray(this.findProcessors) && this.findProcessors.length > 0) {
      return Promise.all(this.findProcessors.map((proc) => proc(entity)));
    }
  }

  private invokeReferencePopulator(
    ref: IEntityRepositoryReferencePopulator,
    entity: TModel,
  ): Promise<void> {
    ref.setPermissionWaiver(this.dbContext.waivePermissions);

    switch (ref.referenceType) {
      case ReferenceType.oneToOne:
        return (ref as IEntityRepositorySingleReferencePopulator<
          TModel
        >).populateReferenceAsync(entity);
      case ReferenceType.oneToMany:
        return (ref as IEntityRepositoryManyReferencesPopulator<
          TModel
        >).populateReferencesAsync(entity);
      default:
        throw new Error(
          `Could not determine reference type for cross reference population.`,
        );
    }
  }

  private async validateCollectionPermissionsAsync(
    ...args: PermissionAction[]
  ): Promise<boolean> {
    if (this.isExemptFromCollectionPermissions) return true;

    const collectionPerms = await this.fetchCollectionPermissionsAsync();

    if (!Array.isArray(collectionPerms) || collectionPerms.length === 0)
      return true;

    const isPermitted = collectionPerms.some((p) =>
      this._permissionsSvc.isUserPermitted(
        this.dbContext.user,
        this.dbContext.waivePermissions,
        p,
        args,
      ),
    );

    return isPermitted;
  }

  private validateEntityPermissions(
    entity: Entity,
    ...actions: PermissionAction[]
  ): boolean {
    return this._permissionsSvc.isUserPermitted(
      this.dbContext.user,
      this.dbContext.waivePermissions,
      entity,
      actions,
    );
  }
}

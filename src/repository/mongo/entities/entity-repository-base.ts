import { Entity } from '@common/models/entities/entity';
import { IMongoEntityRepository } from './imongo-entity-repository';
import { Db, Collection, FilterQuery } from 'mongodb';
import shortid from 'shortid';
import { IEntityRepositoryReferencePopulator } from './references/ientity-repository-reference-populator';
import { logger } from '@common/logging/winston';

const noMongoObjectId = {
  projection: {
    _id: 0,
  },
};

export abstract class EntityRepositoryBase<TModel extends Entity>
  implements IMongoEntityRepository<TModel> {
  constructor(database: Db) {
    logger.debug(`Entering new ${EntityRepositoryBase.name}()`);
    if (!database) {
      logger.error(
        `Argument 'database' must have a value, but got ${JSON.stringify(
          database,
        )}`,
      );
      throw new Error(`Argument 'database' must have a value!`);
    }

    this.database = database;
  }

  protected database: Db;
  protected abstract references: IEntityRepositoryReferencePopulator<TModel>[];
  protected abstract readonly collectionName: string;
  protected abstract readonly factory: new () => TModel;
  protected get collection(): Collection {
    return this.database.collection(this.collectionName);
  }

  // virtual
  protected processors: ((entity: TModel) => Promise<void>)[] = [];

  async findAsync(
    filter: TModel | { [key: string]: unknown } | FilterQuery<unknown>,
  ): Promise<TModel[]> {
    logger.debug(`Entering ${this.findAsync.name}()`);
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

    return entities;
  }

  async findOneAsync(
    filter: TModel | { [key: string]: unknown },
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

    return entity;
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

    return entities;
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

      return entity;
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
    const result = await this.collection.deleteOne({ id });

    return result.deletedCount === 1;
  }

  async updateOneAsync(
    id: string,
    entity: TModel | { [key: string]: unknown },
  ): Promise<boolean> {
    logger.debug(`Entering ${this.updateOneAsync.name}(${id}, entity)`);
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
    const result = await this.collection.updateMany(filter, {
      $set: {
        ...entity,
      },
    });

    return result.modifiedCount > 0;
  }

  async deleteManyAsync(
    filter: { [key: string]: unknown } | TModel,
  ): Promise<boolean> {
    logger.debug(`Entering ${this.deleteManyAsync.name}(filter)`);

    const result = await this.collection.deleteMany(filter);

    return result.deletedCount > 0;
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
        this.references.map((ref) => ref.populateReferenceAsync(entity)),
      );
    }
  }

  private async executeDataProcessorsAsync(entity: TModel): Promise<void[]> {
    if (Array.isArray(this.processors) && this.processors.length > 0) {
      return Promise.all(this.processors.map((proc) => proc(entity)));
    }
  }
}

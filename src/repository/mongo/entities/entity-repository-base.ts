import { Entity } from '@common/models/entities/entity';
import { IMongoEntityRepository } from './imongo-entity-repository';
import { Db, Collection, FilterQuery } from 'mongodb';
import shortid from 'shortid';

const noMongoObjectId = {
  projection: {
    _id: 0,
  },
};

export abstract class EntityRepositoryBase<TModel extends Entity>
  implements IMongoEntityRepository<TModel> {
  constructor(database: Db) {
    if (!database) {
      throw new Error(`Argument 'database' must have a value!`);
    }

    this.database = database;
  }

  protected database: Db;
  protected abstract readonly collectionName: string;
  protected abstract readonly factory: new () => TModel;
  protected get collection(): Collection {
    return this.database.collection(this.collectionName);
  }

  async findAsync(
    filter: TModel | { [key: string]: unknown } | FilterQuery<unknown>,
  ): Promise<TModel[]> {
    const any = await this.collection
      .find(filter, { ...noMongoObjectId })
      .toArray();

    return any.map(this.mapMongoDocumentToEntity.bind(this));
  }

  async findOneAsync(
    filter: TModel | { [key: string]: unknown },
  ): Promise<TModel> {
    const one = await this.collection.findOne(filter, {
      ...noMongoObjectId,
    });

    if (!one) {
      return one;
    }

    return this.mapMongoDocumentToEntity(one);
  }

  async findAllAsync(): Promise<TModel[]> {
    const all = await this.collection
      .find({}, { ...noMongoObjectId })
      .toArray();

    return all.map(this.mapMongoDocumentToEntity.bind(this));
  }

  async findOneByIdAsync(id: string): Promise<TModel> {
    const found = await this.collection.findOne({ id }, { ...noMongoObjectId });

    if (found) {
      return this.mapMongoDocumentToEntity(found);
    }

    return found;
  }

  async insertOneAsync(entity: TModel): Promise<string> {
    if (!entity) {
      throw new Error(`Argument 'entity' must have a value to insert.`);
    }

    entity.id = shortid.generate();

    const result = await this.collection.insertOne(entity);
    
    if (result.insertedCount === 1) {
      return entity.id;
    }

    return null;
  }

  async insertManyAsync(entities: TModel[]): Promise<string[]> {
    if (!Array.isArray(entities)) {
      throw new Error(`Argument 'entities' must be an array to insert many.`);
    }

    entities.forEach((e) => (e.id = shortid.generate()));

    const result = await this.collection.insertMany(entities);

    if (result.insertedCount === entities.length) {
      return entities.map(e => e.id);
    }

    return null;
  }

  async deleteOneAsync(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });

    return result.deletedCount === 1;
  }

  async updateOneAsync(
    id: string,
    entity: TModel | { [key: string]: unknown },
  ): Promise<boolean> {
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
    const result = await this.collection.deleteMany(filter);

    return result.deletedCount > 0;
  }

  private mapMongoDocumentToEntity(doc: unknown): TModel {
    if (!doc)
      throw new Error(`Argument 'doc' is must be an instance of an object.`);

    return Object.assign(new this.factory(), doc);
  }
}

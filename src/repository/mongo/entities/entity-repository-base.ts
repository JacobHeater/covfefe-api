import { Entity } from '@common/models/entities/entity';
import { IMongoEntityRepository } from './imongo-entity-repository';
import { Db, Collection } from 'mongodb';

export abstract class EntityRepositoryBase<TModel extends Entity>
  implements IMongoEntityRepository<TModel> {
  constructor(database: Db) {
    if (!database) {
      throw new Error(`Argument 'database' must have a value!`);
    }

    this.database = database;
  }

  protected database: Db;
  protected abstract get collectionName(): string;
  protected abstract get factory(): new () => TModel;
  protected get collection(): Collection {
    return this.database.collection(this.collectionName);
  }

  async findAsync(
    filter: TModel | { [key: string]: unknown },
  ): Promise<TModel[]> {
    const any = await this.collection.find(filter).toArray();

    return any.map(this.mapMongoDocumentToEntity.bind(this));
  }

  async findOneAsync(
    filter: TModel | { [key: string]: unknown },
  ): Promise<TModel> {
    const one = await this.collection.findOne(filter);

    if (!one) {
      return one;
    }

    return this.mapMongoDocumentToEntity(one);
  }

  async findAllAsync(): Promise<TModel[]> {
    const all = await this.collection.find({}).toArray();

    return all.map(this.mapMongoDocumentToEntity.bind(this));
  }

  async findOneByIdAsync(id: string): Promise<TModel> {
    const found = await this.collection.findOne(
      { id },
      { projection: { _id: 0 } },
    );

    if (found) {
      return this.mapMongoDocumentToEntity(found);
    }

    return found;
  }

  async insertOneAsync(entity: TModel): Promise<boolean> {
    if (!entity) {
      throw new Error(`Argument 'entity' must have a value to insert.`);
    }

    const result = await this.collection.insertOne(entity);

    return result.insertedCount === 1;
  }

  async deleteOneAsync(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });

    return result.deletedCount === 1;
  }

  async insertManyAsync(entities: TModel[]): Promise<boolean> {
    const result = await this.collection.insertMany(entities);

    return result.insertedCount > 0;
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
    if (!doc) throw new Error(`Argument 'doc' is must be an instance of an object.`);
    
    return Object.assign(new this.factory(), doc);
  }
}
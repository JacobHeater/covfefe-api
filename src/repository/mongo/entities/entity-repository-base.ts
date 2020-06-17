import { Entity } from "@common/models/entities/entity";
import { IMongoEntityRepository } from "./imongo-entity-repository";
import { Db } from "mongodb";

export abstract class EntityRepositoryBase<TModel extends Entity> implements IMongoEntityRepository<TModel> {
  constructor(database: Db) {
    if (!database) {
      throw new Error(`Argument 'database' must have a value!`);
    }

    this.database = database;
  }

  protected database: Db;
  protected abstract readonly collectionName: string;
  protected abstract readonly factory: (new () => TModel);
  
  async findOneByIdAsync(id: string): Promise<TModel> {
    const collection = await this.getCollection();
    const found = await collection.findOne({ id }, { projection: { _id: 0 }});

    if (found) {
      return Object.assign(new this.factory(), found);
    }

    return found;
  }

  async insertOneAsync(entity: TModel): Promise<boolean> {
    if (!entity) {
      throw new Error(`Argument 'entity' must have a value to insert.`);
    }

    const collection = await this.getCollection();
    const result = await collection.insertOne(entity);

    if (result.insertedCount === 1) {
      return true;
    }

    return false;
  }

  private async getCollection() {
    return await this.database.collection(this.collectionName);
  }
}

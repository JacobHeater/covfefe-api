import { IMongoEntityRepository } from './entities/imongo-entity-repository';
import { Entity } from '@common/models/entities/entity';
import { MongoConnection } from '@app/database/mongo/mongo-connection';
import { Environment } from '@app/env';
import { EntityRepositoryBase } from './entities/entity-repository-base';
import { Db } from 'mongodb';
import { IDisposable } from '@common/idisposable';

export class RepositoryContainer<TModel extends Entity> implements IDisposable {
  constructor(repositoryFactory: (new (database: Db) => EntityRepositoryBase<TModel>)) {
    this._repositoryFactory = repositoryFactory;
    this._mongo = new MongoConnection(Environment.mongoConnectionString);
  }

  private _repositoryFactory: new (database: Db) => EntityRepositoryBase<TModel>;
  private _mongo: MongoConnection;
  private _repoInstance: IMongoEntityRepository<TModel>;

  async create(): Promise<IMongoEntityRepository<TModel>> {
    if (this._repoInstance) return this._repoInstance;

    await this._mongo.connect();
    this._repoInstance = new this._repositoryFactory(this._mongo.instance);

    return this._repoInstance;
  }

  async destroy(): Promise<void> {
    if (!this._repoInstance) return;

    await this._mongo.disconnect();
    this._repoInstance = null;
  }

  async dispose(): Promise<void> {
    await this.destroy();
  }
}

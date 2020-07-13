import { IMongoEntityRepository } from './entities/imongo-entity-repository';
import { Entity } from '@common/models/entities/entity';
import { MongoConnection } from '@app/database/mongo/mongo-connection';
import { Environment } from '@common/env';
import { EntityRepositoryBase } from './entities/entity-repository-base';
import { IDisposable } from '@common/idisposable';
import { DbRequestContext } from '@app/database/db-request-context';
import { ArgumentMissingError } from '@common/errors/argument-missing-error';
import { factory } from '@common/factory';
import { IUserContext } from '@app/request/iuser-context';
import { logger, fmtErr } from '@common/logging/winston';
import { IRequestContext } from '@app/request/irequest-context';

export class RepositoryContainer<TModel extends Entity> implements IDisposable {
  constructor(
    requestContext: IRequestContext,
    repositoryFactory: new (context: DbRequestContext) => EntityRepositoryBase<
      TModel
    >,
    mongoConnStr: string = Environment.db.mongoConnectionString,
  ) {
    if (!requestContext)
      throw new ArgumentMissingError('requestContext', requestContext);
    if (!repositoryFactory)
      throw new ArgumentMissingError('repositoryFactory', repositoryFactory);
    if (!mongoConnStr)
      throw new ArgumentMissingError('mongoConnStr', mongoConnStr);

    this._requestContext = requestContext;
    this._repositoryFactory = repositoryFactory;
    this._mongo = new MongoConnection(mongoConnStr);
  }

  private _requestContext: IRequestContext;
  private _dbContext: DbRequestContext;
  private _repositoryFactory: new (
    context: DbRequestContext,
  ) => EntityRepositoryBase<TModel>;
  private _mongo: MongoConnection;
  private _repoInstance: IMongoEntityRepository<TModel>;

  async create(): Promise<IMongoEntityRepository<TModel>> {
    if (this._repoInstance) return this._repoInstance;

    try {
      await this._mongo.connect();
    } catch (e) {
      logger.error(
        `An error occurred while attempting to establish a connection to Mongo: ${fmtErr(
          e,
        )}`,
      );
    }

    this._dbContext = factory(DbRequestContext, {
      connection: this._mongo,
      user: this._requestContext.user,
      waivePermissions: this._requestContext.waivePermissions
    });
    this._repoInstance = new this._repositoryFactory(this._dbContext);

    return this._repoInstance;
  }

  async destroy(): Promise<void> {
    if (!this._repoInstance) return;

    await this._repoInstance.dispose();
    this._repoInstance = null;
  }

  async dispose(): Promise<void> {
    await this.destroy();
  }
}

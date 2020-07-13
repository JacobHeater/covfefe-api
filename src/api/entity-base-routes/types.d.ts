import { NextFunction, Response, Request } from 'express';
import { Entity } from '@common/models/entities/entity';
import { EntityRepositoryBase } from '@app/repository/mongo/entities/entity-repository-base';
import { DbRequestContext } from '@app/database/db-request-context';

export type ApiHttpHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response<unknown> | void>;
export type ApiResponse = Promise<Response<unknown> | void>;
export type RepositoryFactory<TEntity extends Entity> = new (db: DbRequestContext) => EntityRepositoryBase<TEntity>;

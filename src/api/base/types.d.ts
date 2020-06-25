import { NextFunction, Response, Request } from 'express';
import { Db } from 'mongodb';
import { Entity } from '@common/models/entities/entity';
import { EntityRepositoryBase } from '@app/repository/mongo/entities/entity-repository-base';

export type ApiHttpHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response<unknown> | void>;
export type ApiResponse = Promise<Response<unknown> | void>;
export type RepositoryFactory<TEntity extends Entity> = new (db: Db) => EntityRepositoryBase<TEntity>;

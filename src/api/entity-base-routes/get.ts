import { Entity } from '@common/models/entities/entity';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { using } from '@common/using';
import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status-codes';
import { ApiHttpHandler, ApiResponse, RepositoryFactory } from './types';
import { HttpContext } from '@app/http/http-context';
import { UserNotPermittedError } from '@common/errors/security/permissions/user-not-permitted-error';

export function createGetManyHandler<TEntity extends Entity>(
  repoFactory: RepositoryFactory<TEntity>,
): ApiHttpHandler {
  return async function getManyOfEntity(
    req: Request,
    res: Response,
    next: NextFunction,
  ): ApiResponse {
    const [items, error] = await using(
      new RepositoryContainer(await HttpContext.createAsync(req), repoFactory),
      async (container) => {
        const repo = await container.create();

        return repo.findAllAsync();
      },
    );

    if (error instanceof UserNotPermittedError) {
      return next(new HttpStatusError(`Unauthorized`, UNAUTHORIZED, error));
    }

    if (error) {
      return next(
        new HttpStatusError(
          `Something went wrong when retrieving items`,
          INTERNAL_SERVER_ERROR,
          error,
        ),
      );
    }

    return res.send(items);
  };
}

export function createGetOneHandler<TEntity extends Entity>(
  repoFactory: RepositoryFactory<TEntity>,
): ApiHttpHandler {
  return async function getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): ApiResponse {
    if (!req.params.id) {
      return next(
        new HttpStatusError(
          `Expected an item id, but got nothing`,
          BAD_REQUEST,
        ),
      );
    }

    const [item, error] = await using(
      new RepositoryContainer(await HttpContext.createAsync(req), repoFactory),
      async (container) => {
        const repo = await container.create();

        return repo.findOneByIdAsync(req.params.id);
      },
    );

    if (!item) {
      return next(new HttpStatusError(`Item not found`, NOT_FOUND, error));
    }

    if (error instanceof UserNotPermittedError) {
      return next(new HttpStatusError(`Unauthorized`, UNAUTHORIZED, error));
    }

    return res.send(item);
  };
}

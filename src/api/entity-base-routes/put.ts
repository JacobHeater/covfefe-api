import { Request, Response, NextFunction } from 'express';
import {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status-codes';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { using } from '@common/using';
import { ApiHttpHandler, ApiResponse, RepositoryFactory } from './types';
import { Entity } from '@common/models/entities/entity';
import { HttpContext } from '@app/http/http-context';
import { UserNotPermittedError } from '@common/errors/security/permissions/user-not-permitted-error';

export function createPutHandler<TEntity extends Entity>(
  repoFactory: RepositoryFactory<TEntity>,
): ApiHttpHandler {
  return async function putEntity(
    req: Request,
    res: Response,
    next: NextFunction,
  ): ApiResponse {
    if (!req.params.id) {
      return next(
        new HttpStatusError(
          `Expected a resource id but didn't get one.`,
          BAD_REQUEST,
        ),
      );
    }

    if (!req.body) {
      return next(
        new HttpStatusError(
          `Expected a resource for update, but didn't get one.`,
          BAD_REQUEST,
        ),
      );
    }

    const [updateResult, error] = await using(
      new RepositoryContainer(await HttpContext.createAsync(req), repoFactory),
      async (container) => {
        const repo = await container.create();
        const updateResult = await repo.updateOneAsync(req.params.id, req.body);

        return updateResult;
      },
    );

    // Item was updated.
    if (updateResult) {
      return res.sendStatus(OK);
    }

    // No update made, and error is empty; this should mean
    // that the resource was not present in the database.
    if (!updateResult && !error) {
      return next(
        new HttpStatusError(`The requested resource was not found`, NOT_FOUND),
      );
    }

    if (error instanceof UserNotPermittedError) {
      return next(new HttpStatusError(
        `Unauthorized`,
        UNAUTHORIZED,
        error
      ))
    }

    // Fallthrough - unknown error.
    return next(
      new HttpStatusError(
        `Something went wrong while updating the resource.`,
        INTERNAL_SERVER_ERROR,
        error,
      ),
    );
  };
}

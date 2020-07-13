import { RepositoryFactory, ApiHttpHandler, ApiResponse } from './types';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { Entity } from '@common/models/entities/entity';
import { using } from '@common/using';
import { HttpContext } from '@app/http/http-context';
import { UserNotPermittedError } from '@common/errors/security/permissions/user-not-permitted-error';

export function createPostHandler<TEntity extends Entity>(
  repoFactory: RepositoryFactory<TEntity>,
  bodyValidator: (body: TEntity | unknown) => boolean,
): ApiHttpHandler {
  return async function postEntity(
    req: Request,
    res: Response,
    next: NextFunction,
  ): ApiResponse {
    if (!req.body) {
      return next(
        new HttpStatusError(`No model was provided for creation`, BAD_REQUEST),
      );
    }

    if (!bodyValidator(req.body)) {
      return next(new HttpStatusError(`The model is invalid.`, BAD_REQUEST));
    }

    const [inserted, error] = await using(
      new RepositoryContainer(await HttpContext.createAsync(req), repoFactory),
      async (container) => {
        const repo = await container.create();
        const id = await repo.insertOneAsync(req.body);

        if (id) {
          const inserted = await repo.findOneByIdAsync(id);
          return inserted;
        }
      },
    );

    if (error instanceof UserNotPermittedError) {
      return next(new HttpStatusError(
        `Unauthorized`,
        UNAUTHORIZED,
        error
      ))
    }

    if (!inserted) {
      return next(
        new HttpStatusError(
          `An error occurred while creating the resource. Please try again.`,
          INTERNAL_SERVER_ERROR,
          error,
        ),
      );
    }

    return res.send(inserted);
  };
}

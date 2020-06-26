import { RepositoryFactory, ApiHttpHandler, ApiResponse } from './types';
import { Entity } from '@common/models/entities/entity';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { using } from '@common/using';
import { BAD_REQUEST, OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';

export function createDeleteHandler<TEntity extends Entity>(
  repoFactory: RepositoryFactory<TEntity>,
): ApiHttpHandler {
  return async function deleteEntity(
    req: Request,
    res: Response,
    next: NextFunction,
  ): ApiResponse {
    if (!req.params.id) {
      return next(new HttpStatusError(`No id was supplied for the delete operation`, BAD_REQUEST));
    }
  
    const [deleteResult, error] = await using(new RepositoryContainer(repoFactory), async container => {
      const repo = await container.create();
      const result = await repo.deleteOneAsync(req.params.id);
  
      return result;
    });
  
    // Item was deleted.
    if (deleteResult) {
      return res.sendStatus(OK);
    }
  
    // Item was not deleted, and there was no error.
    // Safe to assume it was not found.
    if (!deleteResult && !error) {
      return next(new HttpStatusError(`The resource was not found to delete`, NOT_FOUND));
    }
    
    // Fallthrough
    // Unexpected error.
    return next(new HttpStatusError(`Something went wrong while deleting the resource`, INTERNAL_SERVER_ERROR, error)); 
  };
}

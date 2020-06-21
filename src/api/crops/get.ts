import { Request, Response, NextFunction } from 'express';
import { using } from '@common/using';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { CropRepository } from '@app/repository/mongo/crop/crop-repository';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';

export async function getCrops(_: Request, res: Response, next: NextFunction): Promise<Response<unknown> | void> {
  const [crops, error] = await using(new RepositoryContainer(CropRepository), async container => {
    const repo = await container.create();

    return repo.findAllAsync();
  });

  if (error) {
    return next(new HttpStatusError(`Something went wrong when retrieving the resources`, INTERNAL_SERVER_ERROR, error));
  }

  return res.send(crops);
}

export async function getCrop(req: Request, res: Response, next: NextFunction): Promise<Response<unknown> | void> {
  if (!req.params.id) {
    return next(new HttpStatusError(`Expected a resource id, but got nothing`, BAD_REQUEST));
  }

  const [crop, error] = await using(new RepositoryContainer(CropRepository), async container => {
    const repo = await container.create();

    return repo.findOneByIdAsync(req.params.id);
  });

  if (!crop) {
    return next(new HttpStatusError(`Resource not found`, NOT_FOUND, error));
  }

  return res.send(crop);
}

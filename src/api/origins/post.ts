import { Request, Response, NextFunction } from 'express';
import { OriginRepository } from '@app/repository/mongo/origin/origin-repository';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { using } from '@common/using';
import { Origin } from '@common/models/entities/origin/origin';

export async function postOrigin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response<unknown> | void> {
  if (!req.body) {
    return next(
      new HttpStatusError(`No model was provided for creation`, BAD_REQUEST),
    );
  }

  if (!Origin.isValid(req.body)) {
    return next(new HttpStatusError(`The model is invalid.`, BAD_REQUEST));
  }

  const [inserted, error] = await using(
    new RepositoryContainer(OriginRepository),
    async (container) => {
      const originRepo = await container.create();
      const id = await originRepo.insertOneAsync(req.body);

      if (id) {
        const inserted = await originRepo.findOneByIdAsync(id);
        return inserted;
      }
    },
  );

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
}

import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { CropRepository } from '@app/repository/mongo/crop/crop-repository';
import { Crop } from '@common/models/entities/crop/crop';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { using } from '@common/using';

export async function postCrop(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response<unknown> | void> {
  if (!req.body) {
    return next(
      new HttpStatusError(`No model was provided for creation`, BAD_REQUEST),
    );
  }

  if (!Crop.isValid(req.body)) {
    return next(new HttpStatusError(`The model is invalid.`, BAD_REQUEST));
  }

  const [inserted, error] = await using(
    new RepositoryContainer(CropRepository),
    async (container) => {
      const cropRepo = await container.create();
      const id = await cropRepo.insertOneAsync(req.body);

      if (id) {
        const inserted = await cropRepo.findOneByIdAsync(id);
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

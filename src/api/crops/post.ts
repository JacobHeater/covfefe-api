import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { CropRepository } from '@app/repository/mongo/crops/crop-repository';
import { Crop } from '@common/models/entities/crop/crop';
import { HttpStatusError } from '@app/errors/http/http-status-error';
import { using } from '@common/using';

export async function postCrop(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<unknown> | void> {
  if (!req.body) {
    return next(new HttpStatusError(`No ${Crop.name} model was provided for creation`, BAD_REQUEST));
  }

  if (!Crop.isValid(req.body)) {
    return next(new HttpStatusError(`${Crop.name} model is not a valid model.`, BAD_REQUEST));
  }

  return using(new RepositoryContainer(CropRepository), async container => {
    const cropRepo = await container.create();
    const id = await cropRepo.insertOneAsync(req.body);
  
    if (id) {
      const inserted = await cropRepo.findOneByIdAsync(id);
      await container.destroy();
      return res.send(inserted);
    }
  
    throw new HttpStatusError(`An error occurred while creating the ${Crop.name} resource. Please try again.`);
  });  
}

import { Request, Response } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { CropRepository } from '@app/repository/mongo/crops/crop-repository';
import { Crop } from '@common/models/entities/crop/crop';

export async function postCrop(
  req: Request,
  res: Response,
): Promise<Response<unknown>> {
  if (!req.body) {
    return res.send(BAD_REQUEST);
  }

  let container: RepositoryContainer<Crop>;

  try {
    container = new RepositoryContainer(CropRepository);
    const cropRepo = await container.create();
    const id = await cropRepo.insertOneAsync(req.body);

    if (id) {
      const inserted = await cropRepo.findOneByIdAsync(id);
      return res.send(inserted);
    }

    return res.send(INTERNAL_SERVER_ERROR);
  } catch (e) {
    if (e.message) {
      return res.status(INTERNAL_SERVER_ERROR).send(e.message);
    }

    return res.send(INTERNAL_SERVER_ERROR);
  } finally {
    await container.destroy();
  }
}

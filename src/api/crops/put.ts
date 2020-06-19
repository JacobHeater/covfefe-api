import { Request, Response } from "express";
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { CropRepository } from "@app/repository/mongo/crops/crop-repository";
import { RepositoryContainer } from "@app/repository/mongo/repository-container";

export async function putCrop(req: Request, res: Response): Promise<Response<unknown>> {
  if (!req.params.id || !req.body) {
    return res.send(BAD_REQUEST);
  }

  const container = new RepositoryContainer(CropRepository);
  const cropRepo = await container.create();
  const updateResult = await cropRepo.updateOneAsync(req.params.id, req.body);

  await container.destroy();

  if (updateResult) {
    return res.send(OK);
  }

  return res.send(INTERNAL_SERVER_ERROR);
}

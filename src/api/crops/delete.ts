import { Request, Response, NextFunction } from "express";
import { HttpStatusError } from "@app/errors/http/http-status-error";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, NOT_FOUND } from "http-status-codes";
import { using } from "@common/using";
import { RepositoryContainer } from "@app/repository/mongo/repository-container";
import { CropRepository } from "@app/repository/mongo/crop/crop-repository";

export async function deleteCrop(req: Request, res: Response, next: NextFunction): Promise<Response<unknown> | void> {
  if (!req.params.id) {
    return next(new HttpStatusError(`No id was supplied for the delete operation`, BAD_REQUEST));
  }

  const [deleteResult, error] = await using(new RepositoryContainer(CropRepository), async container => {
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
}

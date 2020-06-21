import { Request, Response, NextFunction } from "express";
import { using } from "@common/using";
import { RepositoryContainer } from "@app/repository/mongo/repository-container";
import { OriginRepository } from "@app/repository/mongo/origin/origin-repository";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND } from "http-status-codes";
import { HttpStatusError } from "@app/errors/http/http-status-error";

export async function getOrigins(req: Request, res: Response, next: NextFunction): Promise<Response<unknown> | void> {
  const [origins, error] = await using(new RepositoryContainer(OriginRepository), async container => {
    const repo = await container.create();

    return repo.findAllAsync();
  });

  if (error) {
    return next(new HttpStatusError(`Something went wrong when retrieving Origins`, INTERNAL_SERVER_ERROR, error));
  }

  return res.send(origins);
}

export async function getOrigin(req: Request, res: Response, next: NextFunction): Promise<Response<unknown> | void> {
  if (!req.params.id) {
    return next(new HttpStatusError(`Expected an Origin id, but got nothing`, BAD_REQUEST));
  }

  const [origin, error] = await using(new RepositoryContainer(OriginRepository), async container => {
    const repo = await container.create();

    return repo.findOneByIdAsync(req.params.id);
  });

  if (!origin) {
    return next(new HttpStatusError(`Origin not found`, NOT_FOUND, error));
  }

  return res.send(origin);
}

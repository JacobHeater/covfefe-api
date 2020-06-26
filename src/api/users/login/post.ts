import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@app/api/entity-base-routes/types";
import { OK, NOT_FOUND, BAD_REQUEST } from "http-status-codes";
import { HttpStatusError } from "@app/errors/http/http-status-error";
import { UserAuthenticator } from "@app/security/authentication/user-authenticator";

export async function postLogin(req: Request, res: Response, next: NextFunction): ApiResponse {
  if (!req.body || !req.body.username || !req.body.password) {
    return next(new HttpStatusError(`No credentials were provided for authentication`, BAD_REQUEST));
  }

  const { username, password } = req.body;
  const userAuthenticator = new UserAuthenticator();
  const isAuthenticated = await userAuthenticator.authenticateUsernameAndPasswordAsync(username, password);

  if (isAuthenticated) {
    return res.sendStatus(OK);
  }

  return res.sendStatus(NOT_FOUND);
}

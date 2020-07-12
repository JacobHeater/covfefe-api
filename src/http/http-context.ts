import { Request } from 'express';
import { ArgumentMissingError } from '@common/errors/argument-missing-error';
import { User } from '@common/models/entities/user/user';
import { HeadersParser } from './headers/headers-parser';
import { decodeJwtAsync, getJwtSecret } from '@common/security/jwt';
import { IRequestContext } from '@app/request/irequest-context';
import { IPermissionWaiver } from '@common/security/permissions/ipermission-waiver';

export class HttpContext implements IRequestContext {
  private constructor(req: Request) {
    if (!req) throw new ArgumentMissingError('req');

    this._request = req;
    this._headersParser = new HeadersParser(req);
  }

  static get empty(): HttpContext {
    return {} as HttpContext;
  }

  waivePermissions: IPermissionWaiver = null;

  private readonly _request: Request;
  private readonly _headersParser: HeadersParser;
  private _user: User;

  static async createAsync(req: Request, waivePermissions?: IPermissionWaiver): Promise<HttpContext> {
    const context = new HttpContext(req);
    await context.initCurrentUserAsync();

    context.waivePermissions = waivePermissions;

    return context;
  }


  get user(): User {
    return this._user;
  }

  get request(): Request {
    return this._request;
  }

  private async initCurrentUserAsync(): Promise<void> {
    const jwt = this._headersParser.bearerToken;

    if (jwt) {
      const [isValidJwt, user] = await decodeJwtAsync(jwt, getJwtSecret());

      if (isValidJwt) {
        this._user = user as User;
      }
    }

    return null;
  }
}

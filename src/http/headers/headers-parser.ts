import { Request } from "express";
import { ArgumentMissingError } from "@common/errors/argument-missing-error";
import { IncomingHttpHeaders } from "http";
import { string } from "yargs";

export class HeadersParser {
  constructor(req: Request) {
    if (!req) throw new ArgumentMissingError('req');

    this._request = req;
  }

  private readonly _request: Request;

  private get headers(): IncomingHttpHeaders {
    return this._request.headers;
  }

  get bearerToken(): string {
    const { authorization } = this.headers;

    if (authorization && /Bearer/.test(authorization)) {
      return authorization.replace(/Bearer /, '');
    }

    return '';
  }
}
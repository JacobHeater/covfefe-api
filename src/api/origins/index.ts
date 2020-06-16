import { IRoute } from "../iroute";
import express, { Router } from "express";
import { getOrigin, getOrigins } from "./get";

export const originsRoute: IRoute = {
  exposeRoute(): [string, Router] {
    const router = express.Router();

    router.get('/', getOrigins);
    router.get('/:id', getOrigin);

    return ['/origins', router];
  }
};


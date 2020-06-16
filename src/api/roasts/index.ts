import { IRoute } from "../iroute";
import express, { Router } from "express";
import { getRoasts, getRoast } from "./get";
import { putRoast } from "./put";
import { postRoast } from "./post";
import { deleteRoast } from "./delete";

export const roastsRoute: IRoute = {
  exposeRoute(): [string, Router] {
    const router = express.Router();

    router.get('/', getRoasts);
    router.get('/:id', getRoast);
    router.put('/:id', putRoast);
    router.post('/', postRoast);
    router.delete('/:id', deleteRoast);

    return ['/roasts', router];
  }
};


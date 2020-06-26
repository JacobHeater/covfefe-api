import { IRoute, IRouteComponent } from "../types";
import express from "express";
import { getRoasts, getRoast } from "./get";
import { putRoast } from "./put";
import { postRoast } from "./post";
import { deleteRoast } from "./delete";

export const roastsRoute: IRoute = {
  exposeRoute(): IRouteComponent {
    const router = express.Router();

    router.get('/', getRoasts);
    router.get('/:id', getRoast);
    router.post('/', postRoast);
    router.put('/:id', putRoast);
    router.delete('/:id', deleteRoast);

    return ['/roasts', router];
  }
};

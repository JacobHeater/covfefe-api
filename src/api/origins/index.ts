import { IRoute, IRouteComponent } from "../types";
import express from "express";
import { getOrigin, getOrigins } from "./get";
import { putOrigin } from "./put";
import { postOrigin } from "./post";
import { deleteOrigin } from "./delete";

export const originsRoute: IRoute = {
  exposeRoute(): IRouteComponent {
    const router = express.Router();

    router.get('/', getOrigins);
    router.get('/:id', getOrigin);
    router.post('/', postOrigin);
    router.put('/:id', putOrigin);
    router.delete('/:id', deleteOrigin);
    
    return ['/origins', router];
  }
};

import { IRoute, IRouteComponent } from "../iroute";
import express from "express";
import { getCrops, getCrop } from "./get";
import { putCrop } from "./put";
import { deleteCrop } from "./delete";
import { postCrop } from "./post";

export const cropsRoute: IRoute = {
  exposeRoute(): IRouteComponent {
    const router = express.Router();

    router.get('/', getCrops);
    router.get('/:id', getCrop);
    router.post('/', postCrop);
    router.put('/:id', putCrop);
    router.delete('/:id', deleteCrop);

    return ['/crops', router];
  }
};

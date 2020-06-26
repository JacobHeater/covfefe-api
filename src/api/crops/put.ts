import { createPutHandler } from "../entity-base-routes/put";
import { CropRepository } from "@app/repository/mongo/crop/crop-repository";

export const putCrop = createPutHandler(CropRepository);

import { createPutHandler } from "../base/put";
import { CropRepository } from "@app/repository/mongo/crop/crop-repository";

export const putCrop = createPutHandler(CropRepository);

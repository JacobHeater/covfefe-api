import { createGetManyHandler, createGetOneHandler } from "../base/get";
import { CropRepository } from "@app/repository/mongo/crop/crop-repository";

export const getCrops = createGetManyHandler(CropRepository);
export const getCrop = createGetOneHandler(CropRepository);

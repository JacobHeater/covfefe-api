import { createPostHandler } from "../base/post";
import { CropRepository } from "@app/repository/mongo/crop/crop-repository";
import { Crop } from "@common/models/entities/crop/crop";

export const postCrop = createPostHandler(CropRepository, Crop.isValid);

import { createDeleteHandler } from "../entity-base-routes/delete";
import { CropRepository } from "@app/repository/mongo/crop/crop-repository";

export const deleteCrop = createDeleteHandler(CropRepository);

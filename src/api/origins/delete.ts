import { createDeleteHandler } from "../entity-base-routes/delete";
import { OriginRepository } from "@app/repository/mongo/origin/origin-repository";

export const deleteOrigin = createDeleteHandler(OriginRepository);

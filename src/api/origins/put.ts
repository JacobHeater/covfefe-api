import { createPutHandler } from "../entity-base-routes/put";
import { OriginRepository } from "@app/repository/mongo/origin/origin-repository";

export const putOrigin = createPutHandler(OriginRepository);

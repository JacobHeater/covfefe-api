import { createPutHandler } from "../entity-base-routes/put";
import { RoastRepository } from "@app/repository/mongo/roast/roast-repository";

export const putRoast = createPutHandler(RoastRepository);

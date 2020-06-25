import { createPutHandler } from "../base/put";
import { RoastRepository } from "@app/repository/mongo/roasts/roast-repository";

export const putRoast = createPutHandler(RoastRepository);

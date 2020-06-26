import { createGetManyHandler, createGetOneHandler } from "../entity-base-routes/get";
import { RoastRepository } from "@app/repository/mongo/roast/roast-repository";

export const getRoasts = createGetManyHandler(RoastRepository);
export const getRoast = createGetOneHandler(RoastRepository);

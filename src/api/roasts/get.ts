import { createGetManyHandler, createGetOneHandler } from "../base/get";
import { RoastRepository } from "@app/repository/mongo/roasts/roast-repository";

export const getRoasts = createGetManyHandler(RoastRepository);
export const getRoast = createGetOneHandler(RoastRepository);

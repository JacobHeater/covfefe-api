import { OriginRepository } from "@app/repository/mongo/origin/origin-repository";
import { createGetManyHandler, createGetOneHandler } from "../base/get";

export const getOrigins = createGetManyHandler(OriginRepository);
export const getOrigin = createGetOneHandler(OriginRepository);

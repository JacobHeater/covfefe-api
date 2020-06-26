import { createGetManyHandler, createGetOneHandler } from "../entity-base-routes/get";
import { UserRepository } from "@app/repository/mongo/users/user-repository";

export const getUsers = createGetManyHandler(UserRepository);
export const getUser = createGetOneHandler(UserRepository);

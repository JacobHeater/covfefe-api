import { createGetManyHandler, createGetOneHandler } from "../entity-base-routes/get";
import { RoleRepository } from "@app/repository/mongo/role/role-repository";

export const getRoles = createGetManyHandler(RoleRepository);
export const getRole = createGetOneHandler(RoleRepository);

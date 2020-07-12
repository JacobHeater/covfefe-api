import { createDeleteHandler } from "../entity-base-routes/delete";
import { RoleRepository } from "@app/repository/mongo/role/role-repository";

export const deleteRole = createDeleteHandler(RoleRepository);

import { createPostHandler } from "../entity-base-routes/post";
import { RoleRepository } from "@app/repository/mongo/role/role-repository";
import { Role } from "@common/models/entities/roles/role";

export const postRole = createPostHandler(RoleRepository, Role.isValid);

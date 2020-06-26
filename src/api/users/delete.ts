import { createDeleteHandler } from "../entity-base-routes/delete";
import { UserRepository } from "@app/repository/mongo/users/user-repository";

export const deleteUser = createDeleteHandler(UserRepository);

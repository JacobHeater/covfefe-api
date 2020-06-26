import { createPutHandler } from "../entity-base-routes/put";
import { UserRepository } from "@app/repository/mongo/users/user-repository";

export const putUser = createPutHandler(UserRepository);

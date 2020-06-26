import { createPostHandler } from "../entity-base-routes/post";
import { UserRepository } from "@app/repository/mongo/users/user-repository";
import { User } from "@common/models/entities/user/user";

export const postUser = createPostHandler(UserRepository, User.isValid);

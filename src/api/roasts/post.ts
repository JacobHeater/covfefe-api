import { createPostHandler } from "../entity-base-routes/post";
import { RoastRepository } from "@app/repository/mongo/roast/roast-repository";
import { Roast } from "@common/models/entities/roast/roast";

export const postRoast = createPostHandler(RoastRepository, Roast.isValid);

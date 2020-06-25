import { createPostHandler } from "../base/post";
import { RoastRepository } from "@app/repository/mongo/roasts/roast-repository";
import { Roast } from "@common/models/entities/roast/roast";

export const postRoast = createPostHandler(RoastRepository, Roast.isValid);

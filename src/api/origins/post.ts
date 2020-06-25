import { createPostHandler } from "../base/post";
import { OriginRepository } from "@app/repository/mongo/origin/origin-repository";
import { Origin } from "@common/models/entities/origin/origin";

export const postOrigin = createPostHandler(OriginRepository, Origin.isValid);

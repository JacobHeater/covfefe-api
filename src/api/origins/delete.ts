import { createDeleteHandler } from "../base/delete";
import { OriginRepository } from "@app/repository/mongo/origin/origin-repository";

export const deleteOrigin = createDeleteHandler(OriginRepository);

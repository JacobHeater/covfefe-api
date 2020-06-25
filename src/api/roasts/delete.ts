import { createDeleteHandler } from "../base/delete";
import { RoastRepository } from "@app/repository/mongo/roasts/roast-repository";

export const deleteRoast = createDeleteHandler(RoastRepository);

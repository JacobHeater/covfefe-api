import { createDeleteHandler } from "../entity-base-routes/delete";
import { RoastRepository } from "@app/repository/mongo/roast/roast-repository";

export const deleteRoast = createDeleteHandler(RoastRepository);

import { Entity } from "@common/models/entities/entity";

export interface IMongoEntityRepository<TModel extends Entity> {
  findOneByIdAsync(id: string): Promise<TModel>;
  insertOneAsync(entity: TModel): Promise<boolean>;
}

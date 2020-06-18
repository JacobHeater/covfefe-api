import { Entity } from '@common/models/entities/entity';

export interface IMongoEntityRepository<TModel extends Entity> {
  findAsync(filter: TModel | { [key: string]: unknown }): Promise<TModel[]>;
  findOneAsync(filter: TModel | { [key: string]: unknown }): Promise<TModel>;
  findAllAsync(): Promise<TModel[]>;
  findOneByIdAsync(id: string): Promise<TModel>;
  insertOneAsync(entity: TModel): Promise<boolean>;
  insertManyAsync(entities: TModel[]): Promise<boolean>;
  updateOneAsync(
    id: string,
    entity: TModel | { [key: string]: unknown },
  ): Promise<boolean>;
  updateManyAsync(
    filter: TModel | { [key: string]: unknown },
    entity: TModel | { [key: string]: unknown },
  ): Promise<boolean>;
  deleteOneAsync(id: string): Promise<boolean>;
  deleteManyAsync(
    filter: TModel | { [key: string]: unknown },
  ): Promise<boolean>;
}

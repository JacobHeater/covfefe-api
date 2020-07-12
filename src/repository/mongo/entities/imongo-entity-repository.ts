import { Entity } from '@common/models/entities/entity';
import { IDisposable } from '@common/idisposable';
import { IReceivePermissionWaiver } from '@common/security/permissions/ireceive-permission-exclusion';

export interface IMongoRepository extends IDisposable, IReceivePermissionWaiver {
  collectionName: string;
}

export interface IMongoEntityRepository<TModel extends Entity>
  extends IMongoRepository {
  findAsync(filter: TModel | { [key: string]: unknown }): Promise<TModel[]>;
  findOneAsync(
    filter: TModel | { [key: string]: unknown },
    skipPermissionsChecks?: boolean,
  ): Promise<TModel>;
  findAllAsync(): Promise<TModel[]>;
  findOneByIdAsync(id: string): Promise<TModel>;
  insertOneAsync(entity: TModel): Promise<string>;
  insertManyAsync(entities: TModel[]): Promise<string[]>;
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

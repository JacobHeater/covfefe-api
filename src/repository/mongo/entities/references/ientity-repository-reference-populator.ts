import { Entity } from '@common/models/entities/entity';
import { IReceivePermissionWaiver } from '@common/security/permissions/ireceive-permission-exclusion';

export enum ReferenceType {
  oneToOne,
  oneToMany,
}

export interface IEntityRepositoryReferencePopulator extends IReceivePermissionWaiver {
  referenceType: ReferenceType;
}

export interface IEntityRepositorySingleReferencePopulator<
  TBaseEntity extends Entity
> extends IEntityRepositoryReferencePopulator {
  populateReferenceAsync(entity: TBaseEntity): Promise<void>;
}

export interface IEntityRepositoryManyReferencesPopulator<
  TBaseEntity extends Entity
> extends IEntityRepositoryReferencePopulator {
  populateReferencesAsync(entity: TBaseEntity): Promise<void>;
}

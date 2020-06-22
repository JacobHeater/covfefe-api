import { Entity } from '@common/models/entities/entity';

export interface IEntityRepositoryReferencePopulator<
  TBaseEntity extends Entity
> {
  populateReferenceAsync(entity: TBaseEntity): Promise<void>;
}

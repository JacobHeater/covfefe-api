import { Entity } from '@common/models/entities/entity';
import { IMongoEntityRepository } from '../imongo-entity-repository';
import { Lazy } from '@common/lazy';
import { IEntityRepositoryReferencePopulator } from './ientity-repository-reference-populator';

export abstract class EntityRepositoryReferencePopulatorBase<
  TBaseEntity extends Entity,
  TRefEntity extends Entity
> implements IEntityRepositoryReferencePopulator<TBaseEntity> {
  constructor(refRepo: Lazy<IMongoEntityRepository<TRefEntity>>) {
    if (!refRepo) throw new Error(`Argument 'refRepo' is required.`);

    this._refRepo = refRepo;
  }

  private readonly _refRepo: Lazy<IMongoEntityRepository<TRefEntity>>;

  protected abstract getReferenceId(entity: TBaseEntity): string;
  protected abstract setReferenceObject(
    entity: TBaseEntity,
    ref: TRefEntity,
  ): void;

  async populateReferenceAsync(entity: TBaseEntity): Promise<void> {
    const refObject = await this._refRepo.value.findOneByIdAsync(
      this.getReferenceId(entity),
    );

    if (refObject) this.setReferenceObject(entity, refObject);
  }
}

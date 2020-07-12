import { Entity } from '@common/models/entities/entity';
import { IMongoEntityRepository } from '../imongo-entity-repository';
import { Lazy } from '@common/lazy';
import {
  IEntityRepositoryReferencePopulator,
  ReferenceType,
  IEntityRepositorySingleReferencePopulator,
  IEntityRepositoryManyReferencesPopulator,
} from './ientity-repository-reference-populator';
import { IPermissionWaiver } from '@common/security/permissions/ipermission-waiver';

export abstract class EntityRepositoryReferencePopulatorBase<
  TBaseEntity extends Entity,
  TRefEntity extends Entity
> implements IEntityRepositorySingleReferencePopulator<TBaseEntity> {
  constructor(refRepo: Lazy<IMongoEntityRepository<TRefEntity>>) {
    if (!refRepo) throw new Error(`Argument 'refRepo' is required.`);

    this._refRepo = refRepo;
  }

  readonly referenceType: ReferenceType = ReferenceType.oneToOne;
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

  setPermissionWaiver(waiver: IPermissionWaiver): void {
    this._refRepo.value.setPermissionWaiver(waiver);
  }
}

export abstract class EntityRepositoryManyReferencesPopulatorBase<
  TBaseEntity extends Entity,
  TRefEntity extends Entity
> implements IEntityRepositoryManyReferencesPopulator<TBaseEntity> {
  constructor(refRepo: Lazy<IMongoEntityRepository<TRefEntity>>) {
    if (!refRepo) throw new Error(`Argument 'refRepo' is required.`);

    this._refRepo = refRepo;
  }

  referenceType: ReferenceType = ReferenceType.oneToMany;
  private readonly _refRepo: Lazy<IMongoEntityRepository<TRefEntity>>;

  protected abstract getReferenceIds(entity: TBaseEntity): string[];
  protected abstract setReferenceObject(
    entity: TBaseEntity,
    ref: TRefEntity[]
  ): void;

  async populateReferencesAsync(entity: TBaseEntity): Promise<void> {
    const ids = this.getReferenceIds(entity);

    if (!Array.isArray(ids) || ids.length === 0) {
      return Promise.resolve();
    }

    const refObjects = await this._refRepo.value.findAsync({
      id: {
        $in: ids
      }
    });

    this.setReferenceObject(entity, refObjects);
  }

  setPermissionWaiver(waiver: IPermissionWaiver): void {
    this._refRepo.value.setPermissionWaiver(waiver);
  }
}

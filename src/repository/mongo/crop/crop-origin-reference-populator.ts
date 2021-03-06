import { EntityRepositoryReferencePopulatorBase } from '../entities/references/entity-repository-reference-populator-base';
import { Origin } from '@common/models/entities/origin/origin';
import { Crop } from '@common/models/entities/crop/crop';
import { Lazy } from '@common/lazy';
import { OriginRepository } from '../origin/origin-repository';
import { DbRequestContext } from '@app/database/db-request-context';

export class CropOriginReferencePopulator extends EntityRepositoryReferencePopulatorBase<
  Crop,
  Origin
> {
  constructor(context: DbRequestContext) {
    super(new Lazy<OriginRepository>(() => new OriginRepository(context)));
  }

  protected getReferenceId(entity: Crop): string {
    return entity.origin.id;
  }
  protected setReferenceObject(entity: Crop, ref: Origin): void {
    Object.assign(entity.origin, {
      ...ref,
    });
  }
}

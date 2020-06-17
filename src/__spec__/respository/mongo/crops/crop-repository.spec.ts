import { InMemoryMongoHelper } from '@app/__spec__/helpers/mongo';
import { CropRepository } from '@app/repository/mongo/crops/crop-repository';
import { Crop } from '@common/models/entities/crop/crop';
import { Origin } from '@common/models/entities/origin/origin';

const dbHelper = new InMemoryMongoHelper();
const crop = initCrop();

beforeAll(async () => await dbHelper.start());
afterAll(async () => {
  await dbHelper.cleanup();
  await dbHelper.stop();
});

test('CropRepository should insert a single record when calling insertOneAsync()', async () => {
  const cropRepo = new CropRepository(dbHelper.db);
  const isInserted = await cropRepo.insertOneAsync(crop);

  expect(isInserted).toBe(true);
});

test('CropRepository should find the existing crop in mongo when calling findOneByIdAsync()', async () => {
  const cropRepo = new CropRepository(dbHelper.db);
  const match = await cropRepo.findOneByIdAsync(crop.id);

  expect(match).toBeTruthy();
});

function initCrop() {
  const crop = new Crop();
  crop.origin = new Origin();
  crop.origin.altitude = 2000;
  crop.origin.country = 'Ethiopia';
  crop.origin.estate = 'Some farm in Ethiopia';
  crop.year = new Date().getFullYear();

  return crop;
}

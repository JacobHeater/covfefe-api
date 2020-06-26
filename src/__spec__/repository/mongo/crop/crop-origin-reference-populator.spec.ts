import { CropOriginReferencePopulator } from '@app/repository/mongo/crop/crop-origin-reference-populator';
import { Origin } from '@common/models/entities/origin/origin';
import { InMemoryMongoHelper } from '@app/__spec__/helpers/mongo';
import { random } from 'faker';
import { OriginRepository } from '@app/repository/mongo/origin/origin-repository';
import { Crop } from '@common/models/entities/crop/crop';
import { User } from '@common/models/entities/user/user';
import shortid from 'shortid';

const dbHelper = new InMemoryMongoHelper();

beforeAll(async () => {
  await dbHelper.start();
});

afterAll(async () => {
  await dbHelper.cleanup();
  await dbHelper.stop();
});

test(`It should successfully link a reference to an ${Origin.name} entity that is in the database and populate it`, async () => {
  const originRepo = new OriginRepository(dbHelper.db);
  
  const origin = new Origin();
  origin.user = new User();
  origin.user.id = shortid.generate();
  origin.altitude = random.number();
  origin.country = random.word();
  origin.estate = random.word();
  
  const originId = await originRepo.insertOneAsync(origin);

  expect(originId).toBeTruthy();

  origin.id = originId;

  const crop = new Crop();
  crop.user = new User();
  crop.user.id = shortid.generate();
  crop.origin = new Origin();
  crop.origin.id = originId;
  crop.year = random.number();

  const cropOriginPop = new CropOriginReferencePopulator(dbHelper.db);
  const inMemCrop = new Crop();
  
  inMemCrop.origin = new Origin();
  inMemCrop.origin.id = originId;

  await cropOriginPop.populateReferenceAsync(inMemCrop);

  expect(inMemCrop.origin.country).toBe(origin.country);
  expect(inMemCrop.origin.estate).toBe(origin.estate);
  expect(inMemCrop.origin.id).toBe(origin.id);
  expect(inMemCrop.origin.altitude).toBe(origin.altitude);
});

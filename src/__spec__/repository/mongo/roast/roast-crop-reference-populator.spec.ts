import { RoastCropReferencePopulator } from '@app/repository/mongo/roast/roast-crop-reference-populator';
import { OriginRepository } from '@app/repository/mongo/origin/origin-repository';
import { CropRepository } from '@app/repository/mongo/crop/crop-repository';
import { Origin } from '@common/models/entities/origin/origin';
import { random } from 'faker';
import { Crop } from '@common/models/entities/crop/crop';
import { Roast } from '@common/models/entities/roast/roast';
import { InMemoryMongoHelper } from '@app/__spec__/helpers/mongo';
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
  const cropRepo = new CropRepository(dbHelper.db);

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

  const cropId = await cropRepo.insertOneAsync(crop);

  const roast = new Roast();
  roast.user = new User();
  roast.user.id = shortid.generate();
  roast.crop = new Crop();
  roast.crop.id = cropId;
  roast.cuppingNotes = ['Blueberry', 'Honey', 'Chocolate', 'Lemon Zest'];
  roast.description =
    'A decadent, fruity, complex coffee with astounding blueberry flavors.';
  roast.duration = {
    start: new Date(),
    finish: new Date(),
    firstCrack: new Date(),
    secondCrack: null,
  };
  roast.name = 'Ethiopia Guji from Bodhi Leaf';
  roast.roastLevel = 'City+';

  const inMemoryRoast = new Roast();
  inMemoryRoast.crop = new Crop();
  inMemoryRoast.crop.id = cropId;

  const refPopulator = new RoastCropReferencePopulator(dbHelper.db);

  await refPopulator.populateReferenceAsync(inMemoryRoast);

  expect(inMemoryRoast.crop.year).toEqual(crop.year);
  expect(inMemoryRoast.crop.origin.estate).toEqual(origin.estate);
});

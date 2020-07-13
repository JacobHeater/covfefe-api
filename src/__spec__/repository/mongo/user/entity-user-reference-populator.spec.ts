import { InMemoryMongoHelper } from "@app/__spec__/helpers/mongo";
import { User } from "@common/models/entities/user/user";
import { Crop } from "@common/models/entities/crop/crop";
import { UserRepository } from "@app/repository/mongo/users/user-repository";
import { random } from "faker";
import { EntityUserReferencePopulator } from "@app/repository/mongo/users/entity-user-reference-populator";
import { Origin } from "@common/models/entities/origin/origin";
import { Roast } from "@common/models/entities/roast/roast";
import { DbRequestContext } from "@app/database/db-request-context";
import { WaiverReason } from "@common/security/permissions/ipermission-waiver";

const dbHelper = new InMemoryMongoHelper();
const context: DbRequestContext = {
  connection: dbHelper,
  user: null,
  waivePermissions: {
    waive: true,
    reason: WaiverReason.NoPermissions
  }
};

beforeAll(async () => {
  await dbHelper.connect();
});

afterAll(async () => {
  await dbHelper.dispose();
  await dbHelper.disconnect();
});

test(`It should link a ${User.name} resource to a ${Crop.name} resource`, async () => {
  const userRepo = new UserRepository(context);

  const user = new User();
  user.username = random.word();
  user.password = random.words();

  const userId = await userRepo.insertOneAsync(user);

  const crop = new Crop();
  crop.user = new User();
  crop.user.id = userId;

  const refPopulator = new EntityUserReferencePopulator<Crop>(context);
  
  await refPopulator.populateReferenceAsync(crop);

  expect(crop.user.username).toEqual(user.username);
  expect(crop.user.password).toEqual('');
});

test(`It should link a ${User.name} resource to a ${Origin.name} resource`, async () => {
  const userRepo = new UserRepository(context);

  const user = new User();
  user.username = random.word();
  user.password = random.words();

  const userId = await userRepo.insertOneAsync(user);

  const origin = new Origin();
  origin.user = new User();
  origin.user.id = userId;

  const refPopulator = new EntityUserReferencePopulator<Origin>(context);
  
  await refPopulator.populateReferenceAsync(origin);

  expect(origin.user.username).toEqual(user.username);
  expect(origin.user.password).toEqual('');
});

test(`It should link a ${User.name} resource to a ${Roast.name} resource`, async () => {
  const userRepo = new UserRepository(context);

  const user = new User();
  user.username = random.word();
  user.password = random.words();

  const userId = await userRepo.insertOneAsync(user);

  const roast = new Roast();
  roast.user = new User();
  roast.user.id = userId;

  const refPopulator = new EntityUserReferencePopulator<Roast>(context);
  
  await refPopulator.populateReferenceAsync(roast);

  expect(roast.user.username).toEqual(user.username);
  expect(roast.user.password).toEqual('');
});

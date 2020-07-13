import { UserRepository } from "@app/repository/mongo/users/user-repository";
import { InMemoryMongoHelper } from "@app/__spec__/helpers/mongo";
import { User } from "@common/models/entities/user/user";
import { random } from "faker";
import { WaiverReason } from "@common/security/permissions/ipermission-waiver";

const dbHelper = new InMemoryMongoHelper();

beforeAll(async () => {
  await dbHelper.connect();
});

afterAll(async () => {
  await dbHelper.dispose();
  await dbHelper.disconnect();
});

it(`Should clean a username from the ${User.name} entity on read.`, async () => {
  const userRepo = new UserRepository({
    connection: dbHelper,
    user: null,
    waivePermissions: {
      waive: true,
      reason: WaiverReason.NoPermissions
    }
  });

  const user = new User();
  user.username = random.word();
  user.password = random.words();

  const userId = await userRepo.insertOneAsync(user);

  expect(userId).toBeTruthy();

  const findUser = await userRepo.findOneByIdAsync(userId);

  expect(findUser.id).toEqual(userId);
  expect(findUser.username).toEqual(user.username);
  expect(findUser.password).toEqual('');
});

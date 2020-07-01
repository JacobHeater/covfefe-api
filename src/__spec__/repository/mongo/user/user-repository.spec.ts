import { UserRepository } from "@app/repository/mongo/users/user-repository";
import { InMemoryMongoHelper } from "@app/__spec__/helpers/mongo";
import { User } from "@common/models/entities/user/user";
import { random } from "faker";

const dbHelper = new InMemoryMongoHelper();

beforeAll(async () => {
  await dbHelper.start();
});

afterAll(async () => {
  await dbHelper.cleanup();
  await dbHelper.stop();
});

it(`Should clean a username from the ${User.name} entity on read.`, async () => {
  const db = dbHelper.db;
  const userRepo = new UserRepository(db);

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

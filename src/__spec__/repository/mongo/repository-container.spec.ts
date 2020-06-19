import { RepositoryContainer } from "@app/repository/mongo/repository-container";
import { DummyRepository } from "./dummy/dummy-repository";
import { DummyModel } from "./dummy/models/dummy-model";

test('It should create a connected instance of the repository', async () => {
  const container = new RepositoryContainer(DummyRepository);
  const repo = await container.create();
  const model = new DummyModel();
  model.data = 'This is a test';

  const id = await repo.insertOneAsync(model);

  expect(id).toBeTruthy();

  const one = await repo.findOneByIdAsync(model.id);

  expect(one).toBeTruthy();
  expect(one.id).toBe(model.id);
  expect(one.data).toBe(model.data);

  await container.destroy();
});

import { RepositoryContainer } from "@app/repository/mongo/repository-container";
import { DummyRepository } from "../../helpers/dummy/dummy-repository";
import { DummyModel } from "../../helpers/dummy/models/dummy-model";
import { IMongoEntityRepository } from "@app/repository/mongo/entities/imongo-entity-repository";

let container: RepositoryContainer<DummyModel>;
let repo: IMongoEntityRepository<DummyModel>;

beforeAll(async () => {
  container = new RepositoryContainer(DummyRepository);
  repo = await container.create();
});
afterAll(async () => await container.destroy());

test('It should create a connected instance of the repository', async () => {
  const model = new DummyModel();
  model.data = 'This is a test';

  const id = await repo.insertOneAsync(model);

  expect(id).toBeTruthy();

  const one = await repo.findOneByIdAsync(model.id);

  expect(one).toBeTruthy();
  expect(one.id).toBe(model.id);
  expect(one.data).toBe(model.data);
});

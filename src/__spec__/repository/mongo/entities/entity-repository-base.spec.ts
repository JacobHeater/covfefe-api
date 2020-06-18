import { DummyRepository } from '@app/__spec__/repository/mongo/dummy/dummy-repository';
import { InMemoryMongoHelper } from '@app/__spec__/helpers/mongo';
import { DummyModel } from '../dummy/models/dummy-model';

const dbHelper = new InMemoryMongoHelper();
let dummyRepo: DummyRepository;
let record: DummyModel;

beforeAll(async () => {
  await dbHelper.start();
  dummyRepo = new DummyRepository(dbHelper.db);
});
afterAll(async () => {
  await dbHelper.cleanup();
  await dbHelper.stop();
});

test('It should successfully insert a single record into the collection', async () => {
  record = new DummyModel();
  record.data = 'This is a test';
  const isInserted = await dummyRepo.insertOneAsync(record);

  expect(isInserted).toBe(true);
});

test('It should successfully find the record by id after it has been inserted', async () => {
  const found = await dummyRepo.findOneByIdAsync(record.id);

  expect(found).toBeDefined();
});

test('It should fail to find one by null id', async () => {
  const found = await dummyRepo.findOneByIdAsync(null);

  expect(found).toBeFalsy();
});

test('It should successfully find one with filter', async () => {
  const record = new DummyModel();
  record.data = 'Hello, Jest!';

  const insertResult = await dummyRepo.insertOneAsync(record);

  expect(insertResult).toBe(true);

  const one = await dummyRepo.findOneAsync({
    data: record.data
  });

  expect(one.data).toBe(record.data);
});

test('It should fail to find one with bad filter', async () => {
  const record = new DummyModel();
  record.data = 'Hello, Jest!';

  const insertResult = await dummyRepo.insertOneAsync(record);

  expect(insertResult).toBe(true);

  const one = await dummyRepo.findOneAsync({
    data: 'bad data here...'
  });

  expect(one).toBeFalsy();
});

test('It should successfully find all records', async () => {
  const all = await dummyRepo.findAllAsync();

  expect(Array.isArray(all)).toBe(true);
  expect(all.length).toBeGreaterThan(0);
});

test('It should find the DummyModel record by the data field', async () => {
  const found = await dummyRepo.findAsync({
    data: record.data,
  });

  expect(Array.isArray(found)).toBe(true);
  expect(found.length).toBeGreaterThan(0);
  expect(found[0].data).toBe(record.data);
});

test('It should insert multiple DummyModel records successfully', async () => {
  const records = [1, 2, 3, 4].map(() => new DummyModel());

  records.forEach((r) => (r.data = 'Insert many test'));

  const isSuccessful = await dummyRepo.insertManyAsync(records);

  expect(isSuccessful).toBe(true);
});

test('It should find all records', async () => {
  const result = await dummyRepo.findAllAsync();

  expect(result.length).toBeGreaterThan(1);
});

test('It should update one by id', async () => {
  const record = new DummyModel();
  record.data = 'This is the data';

  const insertResult = await dummyRepo.insertOneAsync(record);

  expect(insertResult).toBe(true);

  const updateResult = await dummyRepo.updateOneAsync(record.id, {
    data: 'This is the data updated',
  });

  expect(updateResult).toBe(true);

  const readResult = await dummyRepo.findOneByIdAsync(record.id);

  expect(readResult.data).toBe('This is the data updated');
});

test('It should update many records', async () => {
  const records = [1, 2, 3].map(() => new DummyModel());
  records.forEach((r) => (r.data = 'Insert many step 1'));

  const insertResult = await dummyRepo.insertManyAsync(records);

  expect(insertResult).toBe(true);

  const updateResult = await dummyRepo.updateManyAsync(
    {
      data: 'Insert many step 1',
    },
    {
      data: 'Update many step 2',
    },
  );

  expect(updateResult).toBe(true);

  const deleteResult = await dummyRepo.deleteManyAsync({
    data: 'Update many step 2',
  });

  expect(deleteResult).toBe(true);
});

test('It should fail to update many for bad filter expression', async () => {
  const records = [1, 2, 3].map(() => new DummyModel());
  records.forEach((r) => (r.data = 'Step 1'));

  const insertResult = await dummyRepo.insertManyAsync(records);

  expect(insertResult).toBe(true);

  const updateResult = await dummyRepo.updateManyAsync(
    {
      data: 'Step 2',
    },
    {
      data: 'Step 3',
    },
  );

  expect(updateResult).toBe(false);
});

test('It should fail to delete many for bad filter expression', async () => {
  const records = [1, 2, 3].map(() => new DummyModel());
  records.forEach((r) => (r.data = 'Should fail delete'));

  const insertResult = await dummyRepo.insertManyAsync(records);

  expect(insertResult).toBe(true);

  const deleteResult = await dummyRepo.deleteManyAsync({
    data: 'Should fails delete', // intentionally misspelled
  });

  expect(deleteResult).toBe(false);
});

test('It should fail to delete one for null id', async () => {
  const deleteResult = await dummyRepo.deleteOneAsync(null);
  expect(deleteResult).toBe(false);
});

test('It should delete many records based on the search criteria', async () => {
  const result = await dummyRepo.deleteManyAsync({
    data: 'Insert many test',
  });

  expect(result).toBe(true);

  const searchResult = await dummyRepo.findAsync({
    data: 'Insert many test',
  });

  expect(searchResult.length).toBe(0);
});

test('It should delete the DummyModel record by id', async () => {
  const isDeleted = await dummyRepo.deleteOneAsync(record.id);

  expect(isDeleted).toBe(true);
});

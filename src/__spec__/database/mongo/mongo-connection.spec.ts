import { MongoConnection } from "@app/database/mongo/mongo-connection";
import { ApiEnvironment } from "@app/env";

test('It should successfully connect to the local mongodb instance.', async () => {
  const mongo = new MongoConnection(ApiEnvironment.mongoConnectionString);

  await expect(mongo.connect()).resolves.not.toThrow();
  await expect(mongo.disconnect()).resolves.not.toThrow();
});

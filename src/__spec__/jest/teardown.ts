import { stopServerAsync } from '../../';
import { MongoConnection } from '../../database/mongo/mongo-connection';
import { Environment } from '../../env';

class TestCleanupMongoConnection extends MongoConnection {
  async cleanup(): Promise<void> {
    const collections = await this.instance.listCollections().toArray();
    await Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => this.instance.collection(collection).drop()),
    );
  }
}

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await stopServerAsync((global as any).server);
  const mongoCleanupConnection = new TestCleanupMongoConnection(Environment.mongoConnectionString);

  await mongoCleanupConnection.connect();
  await mongoCleanupConnection.cleanup();
  await mongoCleanupConnection.dispose();
};

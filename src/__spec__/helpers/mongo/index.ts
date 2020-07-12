import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IMongoConnection } from '@app/database/mongo/imongo-connection';

export class InMemoryMongoHelper implements IMongoConnection {
  constructor() {
    this.db = null;
    this.server = new MongoMemoryServer();
    this.connection = null;
  }

  connection: MongoClient;
  db: Db;
  server: MongoMemoryServer;

  get instance(): Db {
    return this.db;
  }

  /**
   * Start the server and establish a connection
   */
  async connect(): Promise<void> {
    const url = await this.server.getConnectionString();
    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.connection.db(await this.server.getDbName());
  }

  /**
   * Close the connection and stop the server
   */
  async disconnect(): Promise<void> {
    this.connection.close();
    this.server.stop();
  }

  /**
   * Delete all collections and indexes
   */
  async dispose(): Promise<void> {
    const collections = await this.db.listCollections().toArray();
    await Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => this.db.collection(collection).drop()),
    );
  }
}

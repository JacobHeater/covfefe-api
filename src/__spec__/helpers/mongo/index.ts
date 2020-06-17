import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export class InMemoryMongoHelper {
  constructor() {
    this.db = null;
    this.server = new MongoMemoryServer();
    this.connection = null;
  }

  connection: MongoClient;
  db: Db;
  server: MongoMemoryServer;

  /**
   * Start the server and establish a connection
   */
  async start(): Promise<void> {
    const url = await this.server.getConnectionString();
    this.connection = await MongoClient.connect(
      url,
      { useNewUrlParser: true }
    );
    this.db = this.connection.db(await this.server.getDbName());
  }

  /**
   * Close the connection and stop the server
   */
  async stop(): Promise<boolean> {
    this.connection.close();
    return this.server.stop();
  }

  /**
   * Delete all collections and indexes
   */
  async cleanup(): Promise<void> {
    const collections = await this.db.listCollections().toArray();
    await Promise.all(
      collections
        .map(({ name }) => name)
        .map(collection => this.db.collection(collection).drop())
    );
  }
}

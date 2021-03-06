import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { Environment } from '@common/env';
import { IMongoConnection } from './imongo-connection';

export class MongoConnection implements IMongoConnection {
  constructor(
    url: string,
    databaseName?: string,
    options?: MongoClientOptions,
  ) {
    this.url = url;
    this.databaseName = databaseName || Environment.db.mongoDatabaseName || 'covfefe';
    options = Object.assign<MongoClientOptions, MongoClientOptions>(options || {}, {
      useUnifiedTopology: true
    });
    this.client = new MongoClient(this.url, options);
  }

  get instance(): Db {
    if (!this.isConnected)
      throw new Error(
        `You must call .connect() before trying to get the instance of the Db.`,
      );

    return this.client.db(this.databaseName);
  }

  protected isConnected = false;
  protected url: string;
  protected client: MongoClient;
  protected databaseName: string;

  async connect(): Promise<void> {
    this.client = await this.client.connect();
    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.isConnected = false;
  }

  async dispose(): Promise<void> {
    await this.disconnect();
  }
}

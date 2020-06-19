import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { Environment } from '@app/env';

export class MongoConnection {
  constructor(
    url: string,
    databaseName?: string,
    options?: MongoClientOptions,
  ) {
    this._url = url;
    this._client = new MongoClient(this._url, options || {});
    this._databaseName = databaseName || Environment.mongoDatabaseName || 'covfefe';
  }

  get instance(): Db {
    if (!this._isConnected)
      throw new Error(
        `You must call .connect() before trying to get the instance of the Db.`,
      );

    return this._client.db(this._databaseName);
  }

  private _isConnected = false;
  private _url: string;
  private _client: MongoClient;
  private _databaseName: string;

  async connect(): Promise<void> {
    if (this._isConnected) return;

    await this._client.connect();
    this._isConnected = true;
  }

  async disconnect(): Promise<void> {
    if (!this._isConnected) return;

    await this._client.close();
    this._isConnected = false;
  }
}

import { Db } from 'mongodb';
import { IDisposable } from '@common/idisposable';

export interface IMongoConnection extends IDisposable {
  readonly instance: Db;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

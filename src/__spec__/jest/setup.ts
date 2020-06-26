import { startServerAsync } from '../../';
import { LogLevel, setLogLevel } from '@common/logging/winston';

module.exports = async function () {
  process.env.MONGO_CONNECTION_STRING = 'mongodb://localhost:27017';
  process.env.MONGO_DEFAULT_DB = 'TestDatabase';
  setLogLevel(LogLevel.info);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).server = await startServerAsync(5555);
};

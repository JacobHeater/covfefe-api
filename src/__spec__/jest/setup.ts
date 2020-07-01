import { startServerAsync } from '../../';
import { setLogLevel } from '@common/logging/winston';
import { LogLevel } from '@common/logging/winston/log-level';

module.exports = async function () {
  process.env.MONGO_CONNECTION_STRING = 'mongodb://localhost:27017';
  process.env.MONGO_DEFAULT_DB = 'TestDatabase';
  process.env.JWT_SECRET = 'secret_club!';
  setLogLevel(LogLevel.info);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).server = await startServerAsync(5555);
};

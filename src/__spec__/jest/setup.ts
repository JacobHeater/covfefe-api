import { startServerAsync } from '../../';

module.exports = async function () {
  process.env.MONGO_CONNECTION_STRING = 'mongodb://localhost:27017';
  process.env.MONGO_DEFAULT_DB = 'TestDatabase';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).server = await startServerAsync(5555);
};

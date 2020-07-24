import { startServerAsync } from '../../';
import { setLogLevel } from '@common/logging/winston';
import { LogLevel } from '@common/logging/winston/log-level';
import * as request from 'request-promise-native';
import { Environment } from '@common/env';
import { serverResource } from '../helpers';

module.exports = async function () {
  process.env.MONGO_CONNECTION_STRING = 'mongodb://localhost:27017';
  process.env.MONGO_DEFAULT_DATABASE = 'TestDatabase';
  process.env.JWT_SECRET = 'secret_club!';
  process.env.MONGO_ADMIN_PASSWORD = 'p@$$W0rd1234';
  process.env.NODE_ENV = 'development';

  setLogLevel(LogLevel.silent);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).server = await startServerAsync(5555);

  const { token, } = await request.post(serverResource(`api/users/login`), {
    body: {
      username: 'admin',
      password: Environment.db.adminUserPassword
    },
    json: true
  });

  if (!token) throw new Error('Could not login admin user!');

  process.env.API_TOKEN = token;
};

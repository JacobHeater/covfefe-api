import { CropsApiTestSuite } from './test-suites/crops';
import { OriginsApiTestSuite } from './test-suites/origins';
import { RoastsApiTestSuite } from './test-suites/roasts';
import { UsersApiTestSuite } from './test-suites/users';
import { LogLevel } from '@common/logging/winston/log-level';
import { RolesApiTestSuite } from './test-suites/roles';

beforeEach(() => (process.env.LOG_LEVEL = LogLevel.info));

[
  new CropsApiTestSuite(),
  new OriginsApiTestSuite(),
  new RoastsApiTestSuite(),
  new UsersApiTestSuite(),
  new RolesApiTestSuite(),
].forEach((tc) => tc.init());

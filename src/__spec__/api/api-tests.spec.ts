import { CropsApiTestSuite } from './test-suites/crops';
import { OriginsApiTestSuite } from './test-suites/origins';
import { RoastsApiTestSuite } from './test-suites/roasts';

[
  new CropsApiTestSuite(),
  new OriginsApiTestSuite(),
  new  RoastsApiTestSuite()
].forEach(tc => tc.init());

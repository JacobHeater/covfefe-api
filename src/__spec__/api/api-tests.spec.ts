import { CropsApiTestSuite } from './test-suites/crops';
import { OriginsApiTestSuite } from './test-suites/origins';

[
  new CropsApiTestSuite(),
  new OriginsApiTestSuite(),
].forEach(tc => tc.init());

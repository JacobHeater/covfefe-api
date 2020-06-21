import { CropApiTestSuite } from './test-suites/crop';
import { OriginApiTestSuite } from './test-suites/origin';

[
  new CropApiTestSuite(),
  new OriginApiTestSuite(),
].forEach(tc => tc.init());

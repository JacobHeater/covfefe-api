/* eslint-disable jest/no-standalone-expect */
import { ApiTestSuite } from "../../api-test-suite";
import { Origin } from "@common/models/entities/origin/origin";
import { random } from 'faker';

export class OriginApiTestSuite extends ApiTestSuite<Origin> {
  protected modelName = Origin.name;
  protected factory(): Origin {
    const origin = new Origin();
    
    origin.altitude = random.number({
      min: 2000,
      max: 4000
    });
    origin.country = random.word();
    origin.estate = random.word();

    return origin;
  }
  protected routeName = 'origins';
  protected assertPutEquals(model: Origin, response: Origin): void {
    expect(model.estate).toEqual(response.estate);
    expect(model.country).toEqual(response.country);
    expect(model.altitude).toEqual(response.altitude);
  }
  protected updateForPut(model: Origin): Origin {
    model.altitude += 2000;
    model.country = random.word();

    return model;
  }
}

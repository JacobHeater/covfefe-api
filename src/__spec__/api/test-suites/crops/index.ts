import { ApiTestSuite } from "../../api-test-suite";
import { Crop } from "@common/models/entities/crop/crop";
import { Origin } from "@common/models/entities/origin/origin";
import shortid from "shortid";
import { random } from 'faker';
import { User } from "@common/models/entities/user/user";

export class CropsApiTestSuite extends ApiTestSuite<Crop> {
  protected modelName = Crop.name;
  protected factory(): Crop {
    const crop = new Crop();
    crop.user = new User();
    crop.user.id = shortid.generate();
    crop.origin = new Origin();
    crop.origin.id = shortid.generate();
    crop.year = random.number({
      min: 1970,
      max: new Date().getFullYear()
    });

    return crop;
  }
  protected routeName = 'crops';
  protected assertPutEquals(model: Crop, response: Crop): void {
    // eslint-disable-next-line jest/no-standalone-expect
    expect(model.year).toEqual(response.year);
  }
  protected updateForPut(model: Crop): Crop {
    model.year += 100;

    return model;
  }
}

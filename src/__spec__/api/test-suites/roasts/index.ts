/* eslint-disable jest/no-standalone-expect */
import { Roast } from "@common/models/entities/roast/roast";
import { ApiTestSuite, SkipTestsInSuite } from "../../api-test-suite";
import { random } from 'faker';
import { Crop } from "@common/models/entities/crop/crop";
import shortid from "shortid";

export class RoastsApiTestSuite extends ApiTestSuite<Roast> {
  protected factory(): Roast {
    const roast = new Roast();
    roast.crop = new Crop();
    roast.crop.id = shortid.generate();
    roast.cuppingNotes = [
      random.word(),
      random.word()
    ];
    roast.description = random.words();
    roast.duration = {
      start: new Date(),
      finish: new Date(),
      firstCrack: new Date(),
      secondCrack: null
    };
    roast.name = random.words();
    roast.roastLevel = 'City+';

    return roast;
  }
  protected routeName = 'roasts';
  protected modelName: string = Roast.name;
  protected assertPutEquals(model: Roast, response: Roast): void {
    expect(model.name).toEqual(response.name);
    expect(model.roastLevel).toEqual(response.roastLevel);
  }
  protected updateForPut(model: Roast): Roast {
    model.name = random.words();
    model.duration.secondCrack = new Date();
    model.cuppingNotes.push(random.word());

    return model;
  }
}
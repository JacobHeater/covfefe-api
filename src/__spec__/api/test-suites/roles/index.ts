/* eslint-disable jest/no-standalone-expect */
import { ApiTestSuite } from "../../api-test-suite";
import { random } from 'faker';
import { Role } from "@common/models/entities/roles/role";

export class RolesApiTestSuite extends ApiTestSuite<Role> {
  protected factory(): Role {
    const role = new Role();

    role.name = random.word();
    role.description = random.words();

    return role;
  }
  protected routeName = 'roles';
  protected modelName: string = Role.name;
  protected assertPutEquals(model: Role, response: Role): void {
    expect(model.name).toEqual(response.name);
    expect(model.description).toEqual(response.description);
  }

  protected updateForPut(model: Role): Role {
    model.name = random.words();
    model.description = random.words();

    return model;
  }
}
/* eslint-disable jest/no-export */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-standalone-expect */

import { ApiTestSuite } from '../../api-test-suite';
import { User } from '@common/models/entities/user/user';
import { Profile } from '@common/models/entities/user/profile/profile';
import { random } from 'faker';
import * as request from 'request-promise-native';

export class UsersApiTestSuite extends ApiTestSuite<User> {
  protected factory(): User {
    const user = new User();

    user.username = random.word();
    user.password = random.word();
    user.profile = new Profile();
    user.loginAttempts = random.number();
    user.createdOn = new Date();
    user.isActive = random.boolean();

    return user;
  }
  protected routeName = 'users';
  protected modelName: string = User.name;
  protected assertPutEquals(model: User, response: User): void {
    expect(model.username).toEqual(response.username);
    expect(model.password).toEqual(response.password);
  }
  protected updateForPut(model: User): User {
    model.username = random.word();
    model.password = random.words();
    model.isActive = random.boolean();

    return model;
  }

  protected registerAdditionalTests(): void {
    this.registerUsersLoginTests();
  }

  private registerUsersLoginTests(): void {
    test(`It should return a OK status code when a user's username and password are valid`, async () => {
      const user = new User();
      user.username = 'johnDoe';
      user.password = 'password1234';

      const postResponse = await request.post(this.route(), {
        json: true,
        body: user
      })

      expect(postResponse.id).toBeTruthy();

      const loginPromise = request.post(this.loginRoute(), {
        json: true,
        body: {
          ...user
        }
      })

      await expect(loginPromise).resolves.not.toThrow();
    });

    test(`It should return a Not Found status code when a user's username and or password are invalid`, async () => {
      const user = new User();
      user.username = 'janeDoe';
      user.password = 'password1234';

      const postResponse = await request.post(this.route(), {
        json: true,
        body: user
      })

      expect(postResponse.id).toBeTruthy();

      let loginPromise = request.post(this.loginRoute(), {
        json: true,
        body: {
          username: 'fakeusername',
          password: 'badpass'
        }
      });

      await expect(loginPromise).rejects.toThrow(/404/);

      loginPromise = request.post(this.loginRoute(), {
        json: true,
        body: {
          username: user.username,
          password: 'badpass'
        }
      });

      await expect(loginPromise).rejects.toThrow(/404/);

      loginPromise = request.post(this.loginRoute(), {
        json: true,
        body: {
          username: 'nouser',
          password: user.password
        }
      });

      await expect(loginPromise).rejects.toThrow(/404/);
    });
  }

  private loginRoute() {
    return `${this.route()}/login`;
  }
}

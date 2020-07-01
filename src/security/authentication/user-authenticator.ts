import { Lazy } from '@common/lazy';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { User } from '@common/models/entities/user/user';
import { UserRepository } from '@app/repository/mongo/users/user-repository';
import { using } from '@common/using';
import { logger } from '@common/logging/winston';
import { AuthenticationResult } from '@app/models/authentication/authentication-result';
import { generateJwtAsync, getJwtSecret } from '@common/security/jwt';
import { Environment } from '@common/env';

export class UserAuthenticator {
  constructor() {
    this._userRepositoryContainer = new Lazy<RepositoryContainer<User>>(() => {
      return new RepositoryContainer(UserRepository);
    });
  }

  private readonly _userRepositoryContainer: Lazy<RepositoryContainer<User>>;

  async authenticateUsernameAndPasswordAsync(
    username: string,
    password: string,
  ): Promise<AuthenticationResult> {
    const [result, err] = await using(
      this._userRepositoryContainer.value,
      async (container) => {
        const repo = await container.create();
        const matchUser = await repo.findOneAsync({
          username,
          password,
        });

        return {
          authenticated: matchUser !== null,
          user: matchUser,
        };
      },
    );

    if (err) {
      logger.error(
        `There was an error while trying to authenticate user ${username}`,
      );
      logger.error(err.message);

      return {
        token: null,
        user: null,
      };
    }

    const { user, authenticated } = result;

    if (!authenticated) {
      return {
        token: null,
        user: null
      };
    }

    const [, token] = await generateJwtAsync(result.user, getJwtSecret());

    return {
      token,
      user
    }
  }
}

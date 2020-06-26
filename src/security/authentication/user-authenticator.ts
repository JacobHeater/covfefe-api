import { Lazy } from '@common/lazy';
import { RepositoryContainer } from '@app/repository/mongo/repository-container';
import { User } from '@common/models/entities/user/user';
import { UserRepository } from '@app/repository/mongo/users/user-repository';
import { using } from '@common/using';

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
  ): Promise<boolean> {
    const [isAuthenticated, err] = await using(
      this._userRepositoryContainer.value,
      async (container) => {
        const repo = await container.create();
        const matchUser = await repo.findOneAsync({
          username,
          password,
        });

        return matchUser !== null;
      },
    );

    if (!isAuthenticated || err) {
      return false;
    }

    return true;
  }
}

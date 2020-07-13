import { using } from '@common/using';
import { RepositoryContainer } from './repository-container';
import { UserRepository } from './users/user-repository';
import { User } from '@common/models/entities/user/user';
import { Environment } from '@common/env';
import { factory } from '@common/factory';
import { RoleRepository } from './role/role-repository';
import { Role } from '@common/models/entities/roles/role';
import { DatabaseInitialization } from '@common/models/entities/application/database-initialization';
import {
  InitializationStep,
  StepName,
} from '@common/models/entities/application/initialization-step';
import { DatabaseInitializationRepository } from './application/database-initialization-repository';
import { CollectionPermissionRepository } from './permissions/collection-permission-repository';
import { CollectionPermission } from '@common/models/entities/permissions/collection-permission';
import {
  Permission,
  PermissionAction,
  PermissionTarget,
} from '@common/security/permissions/permission';
import { IRequestContext } from '@app/request/irequest-context';
import { WaiverReason } from '@common/security/permissions/ipermission-waiver';

export class MongoStartup {
  private _initialization = new DatabaseInitialization();
  private _requestContext: IRequestContext = {
    user: null,
    waivePermissions: {
      waive: true,
      reason: WaiverReason.AppStartup
    },
  };

  async runAsync(): Promise<void> {
    await this.collectInitializationData();

    if (this.hasBeenInitialized()) return Promise.resolve();

    await this.createDefaultRolesAsync();
    await this.createAdminUsersAsync();
    await this.createRepositoryPermissionsAsync();
  }

  hasBeenInitialized(): boolean {
    return this._initialization.isCompleted;
  }

  private async createDefaultRolesAsync(): Promise<void> {
    if (this._initialization.steps.createDefaultRoles.completed)
      return Promise.resolve();

    await using(
      new RepositoryContainer(this._requestContext, RoleRepository),
      async (container) => {
        const repo = await container.create();
        const defaultRoles = [
          factory(Role, {
            name: Role.rootRoleName,
            description: 'Super user with root privileges.',
          }),
          factory(Role, {
            name: Role.adminRoleName,
            description: 'System user with administrator privileges.',
          }),
          factory(Role, {
            name: Role.userRoleName,
            description: 'System user, with no elevated privileges.',
          }),
        ];

        await repo.insertManyAsync(defaultRoles);
      },
    );

    await this.setInitializedStepAsComplete(StepName.createDefaultRoles);
  }

  private async createAdminUsersAsync(): Promise<void> {
    if (!Environment.db.adminUserPassword)
      throw new Error(`Admin user password was not provided!`);

    if (this._initialization.steps.createAdminUsers.completed)
      return Promise.resolve();

    const [roles] = await using(
      new RepositoryContainer(this._requestContext, RoleRepository),
      async (container) => {
        const repo = (await container.create()) as RoleRepository;

        return await repo.findAllRolesInNames([
          Role.adminRoleName,
          Role.rootRoleName,
        ]);
      },
    );

    await using(
      new RepositoryContainer(this._requestContext, UserRepository),
      async (container) => {
        const repo = await container.create();
        const user = factory(User, {
          username: User.adminUserName,
          password: Environment.db.adminUserPassword,
          roles: roles.map((r) =>
            factory(Role, {
              id: r.id,
            }),
          ),
        });

        await repo.insertOneAsync(user);
      },
    );

    await this.setInitializedStepAsComplete(StepName.createAdminUsers);
  }

  private async createRepositoryPermissionsAsync(): Promise<void> {
    if (this._initialization.steps.createRepositoryPermissions.completed)
      return Promise.resolve();

    const [defaultRoles] = await using(
      new RepositoryContainer(this._requestContext, RoleRepository),
      async (container) => {
        const repo = (await container.create()) as RoleRepository;
        const outVal: { [key: string]: Role } = {};

        const defaultRoles = await repo.findAllRolesInNames([
          Role.userRoleName,
          Role.rootRoleName,
          Role.adminRoleName,
        ]);

        defaultRoles.forEach((r) => (outVal[r.name] = r));

        return outVal;
      },
    );

    await using(
      new RepositoryContainer(
        this._requestContext,
        CollectionPermissionRepository,
      ),
      async (container) => {
        const repo = await container.create();

        const items = [
          factory(CollectionPermission, {
            collectionName: User.collectionName,
            permitted: [
              factory(Permission, {
                actions: [
                  PermissionAction.create,
                  PermissionAction.read,
                  PermissionAction.update,
                ],
                target: PermissionTarget.role,
                targetId: defaultRoles[Role.userRoleName].id,
              }),
            ],
          }),
          factory(CollectionPermission, {
            collectionName: Role.collectionName,
            permitted: [
              factory(Permission, {
                actions: [PermissionAction.read],
                target: PermissionTarget.role,
                targetId: defaultRoles[Role.userRoleName].id,
              }),
            ],
          }),
          factory(CollectionPermission, {
            collectionName: CollectionPermission.collectionName,
            permitted: [
              factory(Permission, {
                actions: [PermissionAction.restricted],
                target: PermissionTarget.role,
                targetId: defaultRoles[Role.userRoleName].id,
              }),
            ],
          }),
        ];

        await repo.insertManyAsync(items);
      },
    );

    await this.setInitializedStepAsComplete(
      StepName.createRepositoryPermissions,
    );
  }

  private async collectInitializationData(): Promise<void> {
    const [init] = await using(
      new RepositoryContainer(
        this._requestContext,
        DatabaseInitializationRepository,
      ),
      async (container) => {
        const repo = await container.create();

        return repo.findOneAsync({});
      },
    );

    this._initialization = init;

    if (!this._initialization) {
      this._initialization = factory(DatabaseInitialization, {
        steps: {
          createAdminUsers: new InitializationStep(StepName.createAdminUsers),
          createDefaultRoles: new InitializationStep(
            StepName.createDefaultRoles,
          ),
          createRepositoryPermissions: new InitializationStep(
            StepName.createRepositoryPermissions,
          ),
        },
      });

      await using(
        new RepositoryContainer(
          this._requestContext,
          DatabaseInitializationRepository,
        ),
        async (container) => {
          const repo = await container.create();

          await repo.insertOneAsync(this._initialization);
        },
      );
    }
  }

  private async setInitializedStepAsComplete(name: StepName) {
    this._initialization.steps[name].completed = true;

    await using(
      new RepositoryContainer(
        this._requestContext,
        DatabaseInitializationRepository,
      ),
      async (container) => {
        const repo = await container.create();

        await repo.updateOneAsync(
          this._initialization.id,
          this._initialization,
        );
      },
    );
  }
}

import { logger } from "@common/logging/winston";

export class ApiEnvironment {
  static get mongoConnectionString(): string {
    return process.env.MONGO_CONNECTION_STRING;
  }

  static get mongoDatabaseName(): string {
    return process.env.MONGO_DEFAULT_DATABASE;
  }

  static get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  static get jwtSecretKey(): string {
    if (!process.env.JWT_SECRET) {
      logger.error([
        `process.env.JWT_SECRET is not present in the environment.`,
        `Auth tokens cannot be generated and the application must not resume.`
      ].join('\n'));
      
      throw new Error('Tokens cannot be generated at this time.');
    }

    return process.env.JWT_SECRET;
  }
}

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
}

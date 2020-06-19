export class Environment {
  static get mongoConnectionString(): string {
    return process.env.MONGO_CONNECTION_STRING;
  }

  static get mongoDatabaseName(): string {
    return process.env.MONGO_DEFAULT_DATABASE;
  }
}

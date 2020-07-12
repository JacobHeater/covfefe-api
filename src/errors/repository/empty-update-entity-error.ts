export class EmptyUpdateEntityError extends Error {
  constructor(collectionName: string) {
    super(`Cannot update an entity for collection ${collectionName} when entity is empty.`);
  }
}

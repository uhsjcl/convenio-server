/**
 * Error type thrown when an email is supplied that does not follow conventional email formatting ##@##.##
 * 
 * @throws 'InvalidEmailError'
 */
export class InvalidEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEmailError';
  }
}

/**
 * Error type thrown when the body supplied to a request is invalid.
 */
export class InvalidBodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBodyError';
  }
}

/**
 * Error type thrown when a database field, object, or item already exists in memory.
 */
export class FieldAlreadyExistsError extends Error {
  private id: string;
  constructor(message: string, id: string) {
    super(message);
    this.name = 'FieldAlreadyExistsError';
    this.id = id;
  }
}

export class FieldNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FieldNotFound';
  }
}

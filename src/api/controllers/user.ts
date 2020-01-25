import { Photon } from '@generated/photon';
import { InvalidBodyError, FieldAlreadyExistsError, FieldNotFoundError } from '../../errors';
import { Request } from 'express';
import { AsyncHandler, respondWithError } from '../../utils';
import * as HttpStatus from 'http-status-codes';

const prisma = new Photon();

interface CreateUser extends Request {
  body: {
    password: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

interface GetUser extends Request {
  params: {
    id?: string;
  };
  body: {
    id?: string;
    email?: string;
  };
}

/**
 * Get user account
 * @param id 
 * @param email 
 */
export const getUser = async (id?: string, email?: string) => {
  if (!id && !email) {
    throw new InvalidBodyError('ID or Email was not specified.');
  }
  let user;
  // Try to find user by ID or email
  if (id) user = prisma.user({ id });
  else user = prisma.user({ email });
  if (user) {
    return user;
  } else {
    throw new FieldNotFoundError(`User ${id ? id : email} does not exist.`);
  }
};

/**
 * POST and GET handler for retrieving user data
 */
export const getUserHandler: AsyncHandler<GetUser> = async (request, response) => {
  // Check if parsing request.param or by POST body
  if (request.path === '/get') {
    try {
      const { id, email } = request.body;
      const result = await getUser(id, email);
      if (result) {
        response.json(result);
      }
    } catch (e) {
      if (e instanceof InvalidBodyError)
        response.status(HttpStatus.BAD_REQUEST);
      else if (e instanceof FieldNotFoundError)
        response.status(HttpStatus.NOT_FOUND);
      else
        response.status(HttpStatus.BAD_REQUEST);
      response.json(respondWithError(e));
    }
  } else {
    try {
      const result = await getUser(request.params.id);
      if (result) {
        response.json(result);
      }
    } catch (e) {
      if (e instanceof InvalidBodyError)
        response.status(HttpStatus.BAD_REQUEST);
      else if (e instanceof FieldNotFoundError)
        response.status(HttpStatus.NOT_FOUND);
      else
        response.status(HttpStatus.BAD_REQUEST);
      response.json(respondWithError(e));
    }
  }
};

/**
 * Create user account
 * @param password 
 * @param firstName 
 * @param lastName 
 * @param email 
 * 
 * @returns JSON-serialized format of user data if the user account was successfully created
 * @returns false if the user account could not be created
 * 
 * @throws InvalidBodyError if a password, first name, or last name is not specified
 */
export const createUser = async (password: string, firstName: string, lastName: string, email?: string) => {
  // validate body fields
  if (!password || !firstName || !lastName) {
    throw new InvalidBodyError('Password, first name, or last name was not specified.');
  }

  // assume we create an account that belongs to a convention organizer
  if (email) {
    // Check if the user exists in database already
    const user = await prisma.user({ email });
    if (user) {
      throw new FieldAlreadyExistsError(`User already exists with email ${email}.`, user.id);
    } 
  }
  const user = await prisma.createUser({ email, password, firstName, lastName });
  return user;
};

/**
 * POST handler for creating a user
 */
export const createUserHandler: AsyncHandler<CreateUser> = async (request, response) => {
  try {
    const { password, firstName, lastName, email } = request.body;
    // Spread operator unsupported for async/await iterables so we have to extrapolate each body element.
    // See https://github.com/tc39/proposal-async-iteration/issues/103
    const result = await createUser(password, firstName, lastName, email);
    if (result) {
      response.json(result);
    }
  } catch (e) {
    if (e instanceof InvalidBodyError)
      response.status(HttpStatus.BAD_REQUEST);
    else if (e instanceof FieldAlreadyExistsError)
      response.status(HttpStatus.CONFLICT);
    else
      response.status(HttpStatus.BAD_REQUEST);
    response.json(respondWithError(e));
  }
};

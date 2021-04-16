import { PrismaClient } from '@prisma/client';
import { FieldNotFoundError, InvalidBodyError } from '../../errors';
import { Request } from 'express';
import { AsyncHandler, respondWithError } from '../../utils';
import StatusCodes from 'http-status-codes';

const prisma = new PrismaClient();

interface CreateEventRequest extends Request {
  body: {
    name: string,
    description?: string
    startTime?: Date,
    endTime?: Date
    location?: string,
    openRegistration: boolean,
    published: boolean
  };
}

interface GetEventRequest extends Request {
  body: {
    id?: string;
    name?: string;
    date?: Date;
    dateStartRange?: Date;
    dateEndRange?: Date;
    location?: string;
    coords?: number;
    max?: number;
  };
}

interface GetEventMemberCount extends Request {
  body: {
    id: string;
  };
}

/**
 * Fetch one event
 * @param id
 * @param title
 * @param date
 */
export const getOne = async (id: string) => {
  if (!id) {
    throw new InvalidBodyError('No ID, title, or date was specified.');
  }
  let event;
  // first try to query event by id
  if (id) event = prisma.event.findUnique({ where: { id } });
  return event;
};

/**
 * Fetch all events that match query parameters
 * @param {String} name
 * @param {Date} dateStartRange - the date begin range to include in the search (inclusive)
 * @param {Date} dateEndRange   - the date end range to include in the search (inclusive)
 * @param {String} location
 * @param {Number=10} max
 */
export const getMany = async (name?: string, dateStartRange?: Date, dateEndRange?: Date, location?: string, max: number = 10) => {
  if (!name && !dateStartRange && !dateEndRange && !location) {
    throw new InvalidBodyError('No event name, date range, or location was specified.');
  }
  let events;
  events = prisma.event.findMany({
    where: {
      name,
      /* date_gte: dateStartRange,
      date_lte: dateEndRange,
      location_contains: location */
    }
  });
  if (events) return events;
  else throw new FieldNotFoundError('No results were found.');
};

export const getEventHandler: AsyncHandler<GetEventRequest> = async (request, response) => {
  if (request.body.id) {
    const event = await getOne(request.body.id);
    if (event) response.json(event).status(StatusCodes.OK);
  } else if (request.params.id) {
    try {
      const result = await getOne(request.params.id);
      if (result) {
        response.json(result);
      }
    } catch (e) {
      if (e instanceof InvalidBodyError)
        response.status(StatusCodes.BAD_REQUEST);
      else if (e instanceof FieldNotFoundError)
        response.status(StatusCodes.NOT_FOUND);
      else
        response.status(StatusCodes.BAD_REQUEST);
      response.json(respondWithError(e));
    }
  } else {
    const { name, dateStartRange, dateEndRange, location, max } = request.body;
    const event = await getMany(name, dateStartRange, dateEndRange, location, max);
    if (event) response.json(event).status(StatusCodes.OK);
  }
};

/**
 * Get the number of members (sign up count) of a specified event
 * @param id of the event
 *
 * @return {Number} the number of users signed up for the event
 */
export const getMemberCount = async (id: string) => {
  if (!id) throw new InvalidBodyError('ID not specified.');
  const memberCount = (await prisma.event.findUnique({ where: { id } }).EventRegistration()).length;
  return memberCount;
};

export const getMemberCountHandler: AsyncHandler<GetEventMemberCount> = async (request, response) => {
  const count = await getMemberCount(request.body.id);
  response.send(count).status(StatusCodes.OK);
};

/**
 * POST handler to create an event from parameters.
 * @param {String} name - the title of the event
 * @param {Date} date - the datetime of the event
 * @param {String} location - location where the event takes place
 * @param {String} body - description of the event to be displayed by a client
 * @param {Boolean} open=false - whether the event is open-enrollment or closed-enrollment
 * @param {Boolean} published=false - whether the event is published to the public
 *
 * @return newly created event object
 */
export const createEvent = async (name: string, description: string, startTime: Date, endTime: Date, location: string, openRegistration: boolean = false, published: boolean = false) => {
  return await prisma.event.create({
    data: {
      name,
      description,
      startTime,
      endTime,
      location,
      openRegistration,
      published
    }
  });
};

export const createEventHandler: AsyncHandler<CreateEventRequest> = async (request: CreateEventRequest, response) => {
  const { name, description, startTime, endTime, location, openRegistration, published } = request.body;
  response.json(await createEvent(name, description, new Date(startTime), new Date(endTime), location, openRegistration, published));
};

import { PrismaClient } from '@prisma/client';
import { FieldNotFoundError, InvalidBodyError } from '../../errors';
import { Request } from 'express';
import { AsyncHandler } from '../../utils';
import { OK } from 'http-status-codes';

const prisma = new PrismaClient();

interface CreateEvent extends Request {
  body: {
    title: string;
    date: Date;
    location: string;
    body?: [string];
    open?: boolean;
    published?: boolean;
  };
}

interface GetEvent extends Request {
  body: {
    id?: string;
    title?: string;
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
  if (id) event = prisma.event.findOne({ where: { id } });
  return event;
};

/**
 * Fetch all events that match query parameters
 * @param {String} title
 * @param {Date} dateStartRange - the date begin range to include in the search (inclusive)
 * @param {Date} dateEndRange   - the date end range to include in the search (inclusive)
 * @param {String} location
 * @param {Number=10} max
 */
export const getMany = async (title?: string, dateStartRange?: Date, dateEndRange?: Date, location?: string, max: number = 10) => {
  if (!title && !dateStartRange && !dateEndRange && !location) {
    throw new InvalidBodyError('No title, date range, or location was specified.');
  }
  let events;
  events = prisma.event.findMany({
    where: {
      title: title,
      /* date_gte: dateStartRange,
      date_lte: dateEndRange,
      location_contains: location */
    }
  });
  if (events) return events;
  else throw new FieldNotFoundError('No results were found.');
};

export const getEventHandler: AsyncHandler<GetEvent> = async (request, response) => {
  if (request.body.id) {
    const event = await getOne(request.body.id);
    if (event) response.json(event).status(OK);
  } else {
    const { title, dateStartRange, dateEndRange, location, max } = request.body;
    const event = await getMany(title, dateStartRange, dateEndRange, location, max);
    if (event) response.json(event).status(OK);
  }
};

/**
 * Get the number of members (sign up count) of a specified event
 * @param id of the event
 *
 * @return {Number} the number of users signed up for the event
 */
export const getMemberCount = async (id: string) => {
  if(!id) throw new InvalidBodyError('ID not specified.');
  const memberCount = prisma.event.findOne({ where: { id } }).members.length;
  return memberCount;
};

export const getMemberCountHandler: AsyncHandler<GetEventMemberCount> = async (request, response) => {
  const count = await getMemberCount(request.body.id);
  response.send(count).status(OK);
};

/**
 * POST handler to create an event from parameters.
 * @param {String} title - the title of the event
 * @param {Date} date - the datetime of the event
 * @param {String} location - location where the event takes place
 * @param {String} body - description of the event to be displayed by a client
 * @param {Boolean} open=false - whether the event is open-enrollment or closed-enrollment
 * @param {Boolean} published=false - whether the event is published to the public
 *
 * @return newly created event object
 */
export const createEvent = async (title: string, date: Date, location: string, body: [string], open: boolean = false, published: boolean = false) => {
  
};

export const createEventHandler: AsyncHandler<CreateEvent> = async (request, response) => {

};

import { prisma } from '../../../prisma/generated/prisma-client';
import { FieldNotFoundError, InvalidBodyError } from '../../errors';
import { Request } from 'express';
import { AsyncHandler } from '../../utils';
import { OK } from 'http-status-codes';

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
export const getOne = async (id?: string, title?: string, date?: Date) => {
  if (!id && !title && !date) {
    throw new InvalidBodyError('No ID, title, or date was specified.');
  }
  let event;
  // first try to query event by id
  if (id) event = prisma.event({ id });
  else event = prisma.event({ title });
};

/**
 * Fetch all events that match query parameters
 * @param {String} title
 * @param {Date} dateStartRange
 * @param {Date} dateEndRange
 * @param {String} location
 * @param max (Default: 10)
 */
export const getMany = async (title?: string, dateStartRange?: Date, dateEndRange?: Date, location?: string, max: number = 10) => {
  if (!title && !dateStartRange && !dateEndRange && !location) {
    throw new InvalidBodyError('No title, date range, or location was specified.');
  }
  let events;
  events = prisma.events({
    where: {
      title_contains: title,
      date_gte: dateStartRange,
      date_lte: dateEndRange,
      location_contains: location
    }
  });
  if (events) return events;
  else throw new FieldNotFoundError('No results were found.');
};

export const getEventHandler: AsyncHandler<GetEvent> = async (request, response) => {

};

/**
 * Get the number of members (sign up count) of a specified event
 * @param id of the event
 *
 * @return {Number} the number of users signed up for the event
 */
export const getMemberCount = async (id: string) => {
  if(!id) throw new InvalidBodyError('ID not specified.');
  const memberCount = prisma.event({ id }).members.length;
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
export const createEvent = async (title: string, date: Date, location: string, body: string, open: boolean = false, published: boolean = false) => {

};

export const createEventHandler: AsyncHandler<CreateEvent> = async (request, response) => {

};

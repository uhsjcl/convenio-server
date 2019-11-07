import { Handler, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, prettyPrint } = format;

/**
 * Async version of Express Request type
 * @see express.Request
 */
export type AsyncHandler<RequestType extends Request> = (request: RequestType, response: Response, next: NextFunction) => Promise<any>;

/**
 * Error response type format used by respondWithError
 * @see respondWithError
 */
type ErrorResponseHandler = (err: Error) => {
  error: string;
  message?: string;
  id?: string;
};

/* 
 * This else if expression checks to see if the node_env property in .env is a developer mode
 * It is effectively equivalent to:
 * if (NODE_ENV === 'dev' || NODE_ENV === 'developer'... etc)
 * but checks many more variations of 'dev'
 * To append new variations of 'dev', simply add strings to the above sequence as if it is an array.
 */
export const isDevEnvironment = () => {
  return ['dev', 'developer', 'development'].indexOf(process.env.NODE_ENV) >= 0;
};

export const endResponse: Handler = (request, response) => {
  response.end();
};

/**
 * Wraps the handler in a higher order function to catch any error that the handler throws and pass it to express's error handler.
 * @function wrapTryCatch
 * @param {AsyncHandler<Request>} handler - Handler to be wrapped
 * @returns {function}
 */
export const wrapTryCatch = (handler: AsyncHandler<Request>): AsyncHandler<Request> => async (request, response, next) => {
  try {
    await handler(request, response, next);
  }
  catch (error) {
    next(error);
  }
};

/**
 * Error handler that extracts error name and message into readable JSON.
 * @param err the error to send back
 */
export const respondWithError: ErrorResponseHandler = (err: Error) => {
  delete err.name;
  return {
    error: err.name,
    message: err.message,
    ...err
  };
};

/**
 * Returns YYYY-MM-DD format of date object.
 * @param {Date} date return YYYY-MM-DD format of date object
 */
export const formatDate = (date: Date) => {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

// noinspection JSUnusedLocalSymbols
/**
 * Takes an error and logs an error message.
 * @function errorHandler
 * @async
 * @param {Error} error - The error to be logged
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export const errorHandler: ErrorRequestHandler = async (error: Error | string, request, response, next) => {
  if (error === 'Request blocked by CORS.') {
    console.warn(`Request at ${request.originalUrl} blocked by CORS.`);
    response.status(HttpStatus.BAD_REQUEST).end();
  }
  else {
    logger.info(`Unexpected error when handling request at ${request.originalUrl}. Details will be logged to error log.`);
    logger.error([
      `Server handling error!`,
      `Error message:`,
      `${error}`,
      `Stacktrace;`,
      (error instanceof Error
        ? error.stack
        : 'Not available'),
      `Request details:`,
      JSON.stringify(request.body, null, '\t')
    ].join('\n'));
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  }
};

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    loggerFormat
  ),
  transports: [
    new transports.File({
      filename: `logs/${formatDate(new Date())}-error.log`,
      level: 'error'
    }),
    new transports.Console({
      format: format.simple(),
      level: 'info'
    })
  ]
});

import { Handler, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { config } from 'dotenv';
import { createLogger, format, transports } from 'winston';
const { combine, printf } = format;

config();

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

/**
 * Check if the server is set up in dev mode
 */
export const isDevMode = () => {
  return process.env.DEVELOPMENT_MODE;
};

//////////////////////////////////////////////
////////// MIDDLEWARES and HANDLERS //////////
//////////////////////////////////////////////

export const requestLogger: Handler = async (request, _, next) => {
  logger.info(`Request received at ${request.path}`);
  next();
};

/**
 * Handler to terminate all responses
 */
export const endResponse: Handler = (_, response) => {
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
    logger.error(error);
    next(error);
  }
};

/**
 * Error handler that extracts error name and message into readable JSON.
 * @param err the error to send back
 */
export const respondWithError: ErrorResponseHandler = (err: Error) => {
  if (isDevMode()) console.error(err);
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
  next();
};

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const loggerOptions = {
  console: {
    handleExceptions: true,
    format: combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      loggerFormat
    )
  },
  file: {
    format: combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      loggerFormat
    )
  }
};

export const logger = createLogger({
  level: 'info',
  transports: [
    new transports.File({
      filename: `logs/${formatDate(new Date())}-error.log`,
      level: 'error',
      ...loggerOptions.file
    }),
    new transports.File({
      filename: `logs/${formatDate(new Date())}.log`,
      ...loggerOptions.file
    }),
    new transports.Console({
      level: 'info',
      ...loggerOptions.console
    }),
  ]
});

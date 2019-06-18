import { Handler, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

// Async version of Express Request type
export type AsyncHandler<RequestType extends Request> = (request: RequestType, response: Response, next: NextFunction) => Promise<any>;

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
    const timeStamp: string = new Date().toUTCString();
    console.error(`[${timeStamp}] Unexpected error when handling request at ${request.originalUrl}\nDetails will be logged to error log.`);
    console.error([
      `[${timeStamp}] Server handling error!`,
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

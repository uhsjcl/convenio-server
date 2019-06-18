import { prisma } from '../prisma/generated/prisma-client';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';

import { router } from './api';

import { endResponse, errorHandler, isDevEnvironment } from './utils';

type CORSCallback = (error: any, allowed?: boolean) => void;

/**
 * Load environment variables config from .env
 */
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Options for Cross-Origin Resource Sharing (CORS).
 * @constant
 * @type {Object}
 */
const corsOptions = {
  origin: (origin: string, cb: CORSCallback) => {
    // If the origin is voluntu.io, allow the request
    if (origin === `https://www.${process.env.PUBLIC_URI}` || origin === `https://${process.env.PUBLIC_URI}`) {
      cb(null, true); // allow the request
    }
    else if (isDevEnvironment()) {
      cb(null, true); // allow all origins in dev mode
    }
    else {
      cb('Request blocked by CORS');
    }
  },
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Cookies', 'Accept'],
  credentials: true
};

const server = express();

// CORS initialization
server.options('*', cors(corsOptions));
server.use(cors(corsOptions));

// body parser middleware to parse json automatically
server.use(bodyParser.json());

// automatically parse cookies with the server secret
server.use(cookieParser(process.env.SESSION_SECRET));

server.use('/api', router);

server.use(endResponse);

server.use(errorHandler);

server.listen(process.env.PORT, () => console.log(`🚀 Listening on port ${process.env.PORT}`));

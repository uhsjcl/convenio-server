import { prisma } from '../prisma/generated/prisma-client';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cluster from 'cluster';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as os from 'os';
import * as path from 'path';

import { logger } from './utils';

import { router } from './api';

import { endResponse, errorHandler, isDevEnvironment } from './utils';

const cpus = os.cpus().length;

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

if (cluster.isMaster) {
  // create a worker for each CPU
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on('online', worker => {
      logger.info(`Worker online, process pid: ${worker.id}`);
  });
  // if worker dies, fork
  cluster.on('exit', (worker, code, signal) => {
      logger.error(`Worker killed, process pid: ${worker.id} | signal: ${signal} | code: ${code}`);
      cluster.fork();
  });
} else {
  const server: express.Express = express();

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
  
  server.listen(process.env.PORT, () => logger.info(`🚀 Worker started: ${cluster.worker.id} | Port ${process.env.PORT}`));
}

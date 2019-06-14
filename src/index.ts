import { prisma } from '../prisma/generated/prisma-client';
import * as cors from 'cors';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const main = async () => {
  console.log('Running');
};

main().catch(e => console.error(e));

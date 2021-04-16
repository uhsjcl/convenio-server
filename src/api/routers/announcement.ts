import { Router } from 'express';
import { wrapTryCatch } from '../../utils';
import { getMemberCountHandler } from '../controllers/event';

export const router: Router = Router();


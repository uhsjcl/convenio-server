import { Router } from 'express';
import { wrapTryCatch } from '../../utils';
import { createEventHandler, getEventHandler, getMemberCountHandler } from '../controllers/event';

export const router: Router = Router();

router.get('/:id', wrapTryCatch(getEventHandler));
router.post('/get', wrapTryCatch(getEventHandler));
router.post('/create', wrapTryCatch(createEventHandler));
router.get('/:id/memberCount', wrapTryCatch(getMemberCountHandler));
router.post('/getMemberCount', wrapTryCatch(getMemberCountHandler));

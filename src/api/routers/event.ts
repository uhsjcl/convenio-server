import { Router } from 'express';
import { createUserHandler, getUserHandler } from '../controllers/user';
import { wrapTryCatch } from '../../utils';
import { getMemberCountHandler } from '../controllers/event';

export const router: Router = Router();

router.get('/:id', wrapTryCatch(getUserHandler));
router.post('/get', wrapTryCatch(getUserHandler));
router.post('/create', wrapTryCatch(createUserHandler));
router.get('/:id/memberCount', wrapTryCatch(getMemberCountHandler));
router.post('/getMemberCount', wrapTryCatch(getMemberCountHandler));

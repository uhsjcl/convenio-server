import { Router } from 'express';
import { createUserHandler, getUserHandler } from '../controllers/user';
import { wrapTryCatch } from '../../utils';

export const router: Router = Router();

router.get('/:id', wrapTryCatch(getUserHandler));
router.post('/get', wrapTryCatch(getUserHandler));
router.post('/create', wrapTryCatch(createUserHandler));

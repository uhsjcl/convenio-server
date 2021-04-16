import { Router } from 'express';
import { logger } from '../utils';
import * as api from './routers';

export const router: Router = Router();

router.use('/user', api.UserRouter);
router.use('/event', api.EventRouter);
router.use('/announcement', api.AnnouncementRouter);
router.use('/tournament', api.TournamentRouter);

router.get('/ping', (_, response) => {
  response.status(200).send('Pong');
});

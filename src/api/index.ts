import { Router } from 'express';
import * as api from './routers';

export const router: Router = Router();

router.use('/user', api.UserRouter);

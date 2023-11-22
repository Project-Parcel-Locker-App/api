import { Router }from 'express';
import { getLockerById, getNearestLocker } from '../controllers/lockerController';

const lockerRouter = Router();

lockerRouter.get('/:id', getLockerById);
lockerRouter.get('/nearest/:userId', getNearestLocker);

export { lockerRouter };

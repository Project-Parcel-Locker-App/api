import { Router }from 'express';
import { getLockerById } from '../controllers/lockerController';

const lockerRouter = Router();

lockerRouter.get('/:id', getLockerById);

export default lockerRouter;

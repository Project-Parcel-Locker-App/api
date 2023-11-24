import { Router } from 'express';
import {
	assignCabinet,
	getLockerById,
	getNearestLocker,
} from '../controllers/lockerController.js';

const lockerRouter = Router();

lockerRouter.get('/:id', getLockerById)
lockerRouter.get('/nearest/:userId', getNearestLocker);
lockerRouter.patch('/:id/assign', assignCabinet);

export { lockerRouter };

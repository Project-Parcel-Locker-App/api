import { Router } from 'express';
import {
	getAllLockers,
	getCabinetById,
	getCabinetsByLockerId,
	getLockerById,
} from '../controllers/lockerController.js';

const lockerRouter = Router();

lockerRouter.get('/', getAllLockers);
lockerRouter.get('/:id/', getLockerById);
lockerRouter.get('/:id/cabinets', getCabinetsByLockerId);
lockerRouter.get('/:id/cabinets/:cabinetId', getCabinetById);

export { lockerRouter };

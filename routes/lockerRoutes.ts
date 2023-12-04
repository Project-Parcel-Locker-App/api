import { Router } from 'express';
import {
	getAllLockers,
	getCabinetById,
	getLockerById,
	getLockerCabinets,
} from '../controllers/lockerController.js';

const lockerRouter = Router();

lockerRouter.get('/', getAllLockers);
lockerRouter.get('/:id/', getLockerById);
lockerRouter.get('/:id/cabinets', getLockerCabinets);
lockerRouter.get('/:id/cabinets/:cabinetId', getCabinetById);

export { lockerRouter };

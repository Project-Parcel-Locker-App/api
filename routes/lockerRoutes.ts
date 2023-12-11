import { Router } from 'express';
import {
	getAllCabinets,
	getAllLockers,
	getCabinetById,
	getLocker,
	updateCabinet,
} from '../controllers/lockerController.js';

const lockerRouter = Router();

lockerRouter.get('/', getAllLockers);
lockerRouter.get('/:id/', getLocker);
lockerRouter.get('/:id/cabinets', getAllCabinets);
lockerRouter.route('/:id/cabinets/:cabinetId')
	.get(getCabinetById)
	.patch(updateCabinet);

export { lockerRouter };

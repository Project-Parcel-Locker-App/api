import express from 'express';
import {
	deleteParcel,
	getParcelByCode,
	getParcelInfo,
	updateParcelNoUserId,
	generateRandomParcels,
} from '../controllers/parcelController.js';

const parcelRouter = express.Router();

parcelRouter
	.route('/:id')
	.get(getParcelInfo)
	.patch(updateParcelNoUserId)
	.delete(deleteParcel);
parcelRouter.post('/codes', getParcelByCode);
parcelRouter.post('/generator', generateRandomParcels);

export { parcelRouter };

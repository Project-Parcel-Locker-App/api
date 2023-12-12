import express from 'express';
import {
	deleteParcel,
	getParcelByCode,
	getParcelInfo,
	updateParcelNoUserId,
} from '../controllers/parcelController.js';

const parcelRouter = express.Router();

// parcelRouter.get('/', getAllParcels);
parcelRouter
	.route('/:id')
	.get(getParcelInfo)
	.patch(updateParcelNoUserId)
	.delete(deleteParcel);
parcelRouter.post('/codes', getParcelByCode);

export { parcelRouter };

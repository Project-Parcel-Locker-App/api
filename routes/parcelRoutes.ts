import express from 'express';
import { deleteParcel, getParcelInfo, updateParcel } from '../controllers/parcelController.js';

const parcelRouter = express.Router();

// parcelRouter.get('/', getAllParcels);
parcelRouter.route('/:id')
  .get(getParcelInfo)
  .patch(updateParcel)
  .delete(deleteParcel);

// parcelRouter
// 	.route('/:id')
// 	.get(ParcelController.getParcelById)
// 	.patch(ParcelController.updateParcelById)
// 	.delete(ParcelController.deleteParcelById);
// parcelRouter
// 	.route('/:id/status')
//  .get(ParcelController.getParcelStatusById)
// 	.patch(ParcelController.updateParcelStatusById);
// parcelRouter.(':id/pickup').patch(ParcelController.pickupParcelById);
// parcelRouter.(':id/dropoff').patch(ParcelController.dropoffParcelById);

export { parcelRouter };

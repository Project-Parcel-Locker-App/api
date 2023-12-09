import express from 'express';
// import { parcelController } from '../controllers/parcelController.js';

const parcelRouter = express.Router();

// parcelRouter
// 	.route('/')
// 	.get(ParcelController.getAllParcels)
// 	.post(parcelController.createParcel);
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



/*
lockers/:lockerId/cabinets/:cabinetId/parcels
lockers/:lockerId/parcels add and get parcels
*/

export { parcelRouter };

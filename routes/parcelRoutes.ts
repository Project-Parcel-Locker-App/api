import express from 'express';
import ParcelController from '../controllers/parcelController.js'

const parcelRouter = express.Router();

parcelRouter.post('/send', ParcelController.sendParcel);
parcelRouter.get('/parcels/', ParcelController.getParcelInfo);
parcelRouter.put('/parcels/update', ParcelController.updateParcelStatus);

export default parcelRouter;

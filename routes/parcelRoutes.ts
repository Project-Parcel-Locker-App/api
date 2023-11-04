import express from 'express';
import { sendParcel, getParcelInfo, updateParcelStatus } from '../controllers/parcelController';

const parcelRouter = express.Router();

parcelRouter.post('/send', sendParcel);
parcelRouter.get('/:parcelID', getParcelInfo);
parcelRouter.put('/:parcelID/update', updateParcelStatus);

export default parcelRouter;

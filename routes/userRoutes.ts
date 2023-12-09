import { getNearestLockers } from 'controllers/lockerController.js';
import express from 'express';
import { createParcel, updateParcel } from '../controllers/parcelController.js';
import {
	deleteUserById,
	getUserInfo,
	getUserParcelInfo,
	getUserParcels,
	updateUserById,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter
	.route('/:id')
	.get(getUserInfo)
	.patch(updateUserById)
	.delete(deleteUserById);
userRouter.route('/:id/parcels')
	.get(getUserParcels)
	.post(createParcel);
userRouter.get('/:id/parcels/:parcelId', getUserParcelInfo);
userRouter.get('/:id/nearby-lockers', getNearestLockers);

export { userRouter };

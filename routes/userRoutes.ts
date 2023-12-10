import { getNearestLockers } from 'controllers/lockerController.js';
import express from 'express';
import { createParcel, updateParcel } from '../controllers/parcelController.js';
import {
	deleteUserInfo,
	updateUserInfo,
	userInfo,
	userParcelInfo,
	userParcels,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter
	.route('/:id')
	.get(userInfo)
	.patch(updateUserInfo)
	.delete(deleteUserInfo);
userRouter.route('/:id/parcels')
	.get(userParcels)
	.post(createParcel);
userRouter.route('/:id/parcels/:parcelId')
	.get(userParcelInfo)
	.patch(updateParcel);
userRouter.get('/:id/nearby-lockers', getNearestLockers);

export { userRouter };

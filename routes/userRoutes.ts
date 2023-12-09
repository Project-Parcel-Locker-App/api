import { getNearestLockers } from 'controllers/lockerController.js';
import express from 'express';
import { authenticateToken } from 'middleware/authorization.js';
import { createParcel, updateParcel } from '../controllers/parcelController.js';
import {
	deleteUserById,
	getUserById,
	getUserParcelInfo,
	getUserParcels,
	registerUser,
	updateUserById,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter
	.route('/:id')
	.get(authenticateToken, getUserById)
	.patch(authenticateToken, updateUserById)
	.delete(authenticateToken, deleteUserById);
userRouter.route('/:id/parcels')
	.get(authenticateToken, getUserParcels)
	.post(authenticateToken, createParcel);
userRouter.get('/:id/parcels/:parcelId', authenticateToken, getUserParcelInfo);
userRouter.get('/:id/nearby-lockers', authenticateToken, getNearestLockers);

export { userRouter };

import { getNearestLockers } from 'controllers/lockerController.js';
import express from 'express';
import { authenticateToken } from 'middleware/authorization.js';
import {
	deleteUserById,
	getUserById,
	getUserParcelById,
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
userRouter.get('/:id/parcels', authenticateToken, getUserParcels);
userRouter.get('/:id/parcels/:parcelId', authenticateToken, getUserParcelById);
userRouter.get('/:id/nearby-lockers', authenticateToken, getNearestLockers);

export { userRouter };

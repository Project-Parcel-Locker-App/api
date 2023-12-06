import { getNearestLockers } from 'controllers/lockerController.js';
import express from 'express';
import { authenticateToken } from 'middleware/authorization.js';
import {
	deleteUserById,
	getUserById,
	registerUser,
	updateUserById,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/:id/nearby-lockers', getNearestLockers);
userRouter.post('/register', registerUser);
userRouter
	.route('/:id')
	.get(authenticateToken, getUserById)
	.patch(authenticateToken, updateUserById)
	.delete(authenticateToken, deleteUserById);

export { userRouter };

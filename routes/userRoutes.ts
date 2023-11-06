import express from 'express';
import { registerUser, loginUser, getUserInfo } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/:userID', getUserInfo);

export default userRouter;

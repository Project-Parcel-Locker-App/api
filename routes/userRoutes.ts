import express from 'express';
import { UserController } from 'controllers/userController';

const userRouter = express.Router();

userRouter.post('/register', UserController.registerUser);
userRouter.post('/login', UserController.loginUser);
userRouter.get('/profile', UserController.getUserInfo);

export default userRouter;

import { register, login, logout, refreshToken } from 'controllers/authController.js';
import express from 'express';
import { authenticateToken, authenticateRefreshToken } from 'middleware/authorization.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authenticateToken, logout);
authRouter.post('/token/refresh', authenticateRefreshToken, refreshToken);

export { authRouter };

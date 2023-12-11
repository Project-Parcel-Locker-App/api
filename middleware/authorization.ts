import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import { userModel } from '../models/users.js';
import { User } from '../schemas/user.js';
import { verifyToken } from '../utils/tokenHandler.js';

// Makes TypeScript aware of the user object in the request object
export interface CustomRequest extends Request {
	user?: User
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.split(' ')[1];
	if (!accessToken) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	try {
		const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);
		(req as CustomRequest).user = decoded as User;
		return next();
	} catch (err) {
		console.error(err);
		if (err instanceof Error && err.message === 'jwt expired' || err instanceof Error && err.message === 'invalid token') {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Token is invalid or has expired' });
		}
		return res.status(403).json({ message: 'Forbidden access' });
	}
};

const authenticateRefreshToken = async (req: Request,	res: Response, next: NextFunction) => {
	const refreshToken = req.headers.authorization?.split(' ')[1];
	// const refreshToken: string | undefined = req.cookies._refresh_token_;
	if (!refreshToken) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	try {
		const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret);
		const userId = (decoded as User).id;
		const userRefreshToken = await userModel.getRefreshTokenById((userId as string));
		if (!userRefreshToken || userRefreshToken !== refreshToken) {
			return res.status(404).json({ message: 'User not found' });
		}
		(req as CustomRequest).user = decoded as User;
		return next();
	} catch (err) {
		console.error(err)
		if (err instanceof Error && err.message === 'jwt expired' || err instanceof Error && err.message === 'invalid token') {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Token is invalid or has expired' });
		}
	}
};

export { authenticateToken, authenticateRefreshToken };

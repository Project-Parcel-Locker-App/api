import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { Secret, VerifyErrors } from 'jsonwebtoken';
import { User } from '../schemas/user.js';

dotenv.config();

// Makes TypeScript aware of the user object on the request object
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.split(' ')[1];

	if (!accessToken) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	jwt.verify(
		accessToken,
		process.env.ACCESS_TOKEN_SECRET as Secret,
		(err: VerifyErrors | null) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					return res
						.status(401)
						.json({ message: 'Unauthorized: Token has expired' });
				}
				return res.status(403).json({ message: 'Forbidden access' });
			}
			next();
		},
	);
};

const authenticateRefreshToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const refreshToken: string | undefined = req.cookies._refresh_token_;

	if (!refreshToken) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET as Secret,
		(err: VerifyErrors | null, user: User | undefined) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					return res
						.status(401)
						.json({ message: 'Unauthorized: Token has expired' });
				}
				return res.status(403).json({ message: 'Forbidden access' });
			}
			if (user) {
				req.user = user;
			}
			next();
		},
	);
};

export { authenticateToken, authenticateRefreshToken };

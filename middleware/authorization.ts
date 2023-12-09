import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { Secret, VerifyErrors } from 'jsonwebtoken';
// import { userModel } from 'models/users.js';
// import { User } from '../schemas/user.js';
import { pool } from '../utils/dbConnect.js';
import { verifyToken } from '../utils/tokenHandler.js';

// Makes TypeScript aware of the user object in the request object
export interface CustomRequest extends Request {
	user?: User;
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.split(' ')[1];
	if (!accessToken) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' });
	}

	try {
		// Verify access token
		const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);
		(req as CustomRequest).user = decoded;
		return next();
	} catch (err: VerifyErrors) {
		console.error(err);
		if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
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
		// Verify refresh token
		const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret);
		(req as CustomRequest).user = decoded;

		// Verify refresh token is stored in database and belongs to user
		const userQuery = 'SELECT id FROM users WHERE refresh_token = $1';
		const userResult = await pool.query(userQuery, [refreshToken]);
		if (!userResult.rows[0].id) {
			return res
				.status(403)
				.json({ message: 'Forbidden access' });
		}

		return next();
	} catch (err: VerifyErrors) {
		console.error(err);
		if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Token is invalid or has expired' });
		}
		return res.status(403).json({ message: 'Forbidden access' });
	}
};

export { authenticateToken, authenticateRefreshToken };

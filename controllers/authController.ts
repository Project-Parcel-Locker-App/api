import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../schemas/user.js';
import { pool } from '../utils/database.js';

const refreshToken = async (req: Request, res: Response) => {
	const user = req.user as User;

	const newAccessToken = jwt.sign(
		{ _id: user.id, user_role: user.user_role },
		process.env.ACCESS_TOKEN_SECRET as Secret,
		{ expiresIn: '15min' },
	);

	return res.status(200).json({ _access_token_: newAccessToken });
};

const login = async (req: Request, res: Response) => {
	const { email, password }: { email: string; password: string } = req.body;

	try {
		const userQuery = 'SELECT * FROM users WHERE email = $1';
		const userResult = await pool.query(userQuery, [email]);
		const user: User = userResult.rows[0];

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const { password_hash } = user;
		const validPassword = await compare(password, password_hash);

		if (!validPassword) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Invalid credentials' });
		}

		// Generate access token
		const accessToken = jwt.sign(
			{ _id: user.id, user_role: user.user_role },
			process.env.ACCESS_TOKEN_SECRET as Secret,
			{ expiresIn: '15min' },
		);

		// Generate refresh token
		const refreshToken = jwt.sign(
			{ _id: user.id, user_role: user.user_role },
			process.env.REFRESH_TOKEN_SECRET as Secret,
			{ expiresIn: '7d' },
		);

		return res
			.status(200)
			.cookie('_refresh_token_', refreshToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				secure: process.env.NODE_ENV === 'production' ? true : false,
				path: '/api/auth/refresh-token',
			})
			.json({
				user_id: user.id,
				_access_token_: accessToken,
			});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

const logout = async (_req: Request, res: Response) => {
	res.clearCookie('_refresh_token_');
	return res.status(200).json({ message: 'User logged out' });
};

export { login, logout, refreshToken };

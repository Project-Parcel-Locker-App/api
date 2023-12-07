import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { CustomRequest } from 'middleware/authorization.js';
import { signTokens } from 'utils/tokenHandler.js';
// import { User } from '../schemas/user.js';
import { pool } from '../utils/dbConnect.js';

const refreshToken = async (req: Request, res: Response) => {
	const user = (req as CustomRequest).user as User;

	const { accessToken } = signTokens({
		_id: user.id,
		user_role: user.user_role,
	});

	return res.status(200).json({ _access_token_: accessToken });
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

		// Compare passwords
		const { password_hash } = user;
		const validPassword = await compare(password, password_hash);

		if (!validPassword) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Invalid credentials' });
		}

		// Generate tokens
		const { accessToken, refreshToken } = signTokens({
			_id: user.id,
			user_role: user.user_role,
		});

		// Store refresh token in database
		const updateQuery = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
		await pool.query(updateQuery, [refreshToken, user.id]);

		return res
			.status(200)
			.cookie('_refresh_token_', refreshToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				sameSite: 'none',
				secure: process.env.NODE_ENV === 'production' ? true : false,
				path: '/api/auth/refresh-token',
			})
			.json({
				user_id: user.id,
				_access_token_: accessToken,
				_refresh_token_: refreshToken,
			});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const logout = async (req: Request, res: Response) => {
	const userId = req.body.user_id;
	const deleteQuery = 'UPDATE users SET refresh_token = $1 WHERE id = $2';

	try {
		await pool.query(deleteQuery, [null, userId]);
		res.clearCookie('_refresh_token_', { path: '/api/auth/refresh-token' });
		return res.status(200).json({ message: 'User logged out' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

export { login, logout, refreshToken };

import { compare, genSalt, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { CustomRequest } from 'middleware/authorization.js';
import { signTokens } from 'utils/tokenHandler.js';
import { User } from '../schemas/user.js';
import { pool } from '../utils/dbConnect.js';
import { userModel } from 'models/users.js';
import { validatePartialUser } from 'schemas/user.js';

const register = async (req: Request, res: Response) => {
	let { password } = req.body;
	const newUser: User = {
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		email: req.body.email,
		password_hash: '',
		phone_number: req.body.phoneNumber,
		user_role: req.body.userRole,
		address: {
			street: req.body.street,
			zip_code: Number(req.body.zipCode),
			city: req.body.city,
			country: req.body.country,
		},
	};

	const validation = validatePartialUser(newUser);
	if (!validation.success) {
		return res.status(400).json({ message: 'Invalid user data', error: validation.error });
	}

	try {
		const existingUser = await userModel.getIdByEmail(newUser.email);
		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}

		// Hash password
		const salt = await genSalt(12);
		const hashedPassword = await hash(password, salt);
		password = null;

		newUser.password_hash = hashedPassword;
		const userId = await userModel.create(newUser);

		if (userId === 'Coordinates not found') {
			return res.status(400).json({ message: 'Address not found or it has invalid format' });
		}

		// Generate tokens
		const { accessToken, refreshToken } = signTokens({
			id: userId,
			user_role: newUser.user_role,
		});

		await userModel.updateRefreshTokenById(userId, refreshToken);

		return res
			.status(201)
			.cookie('_refresh_token_', refreshToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				sameSite: 'none',
				secure: process.env.NODE_ENV === 'production' ? true : false,
				path: '/api/auth/refresh-token',
			})
			.json({
				user_id: userId,
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
}

const refreshToken = async (req: Request, res: Response) => {
	const user = (req as CustomRequest).user as User;

	const { accessToken } = signTokens({
		id: user.id,
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
			id: user.id,
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

export { register, login, logout, refreshToken };

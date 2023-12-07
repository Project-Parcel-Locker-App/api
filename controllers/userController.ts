import { genSalt, hash } from 'bcrypt';
import 'dotenv/config';
import { Request, Response } from 'express';
import { parcelModel } from 'models/parcels.js';
import { getCoordinates } from 'utils/geolocation.js';
import { signTokens } from 'utils/tokenHandler.js';
import { Parcel } from '../schemas/parcel.js';
import { pool } from '../utils/dbConnect.js';

const registerUser = async (req: Request, res: Response) => {
	let { password } = req.body;
	const {
		firstName,
		lastName,
		email,
		phoneNumber,
		userRole,
		street,
		zipCode,
		city,
		country,
	} = req.body;

	try {
		// Check if user exists
		const userQuery = 'SELECT * FROM users WHERE email = $1';
		const userResult = await pool.query(userQuery, [email]);
		const user = userResult.rows[0];
		if (user) {
			return res.status(409).json({ message: 'User already exists' });
		}

		// Hash password
		const salt = await genSalt(12);
		const hashedPassword = await hash(password, salt);
		password = undefined;

		// Extract longitude and latitude from address
		const { lat, lon } = await getCoordinates(street, zipCode, city);

		const locationQuery =
			'INSERT INTO locations (street, zip_code, city, country, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
		const addressResult = await pool.query(locationQuery, [
			street,
			zipCode,
			city,
			country,
			lat,
			lon,
		]);
		const location = addressResult.rows[0];

		const createUserQuery =
			'INSERT INTO users (first_name, last_name, email, phone_number, password_hash, user_role, location_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
		const newUserResult = await pool.query(createUserQuery, [
			firstName,
			lastName,
			email,
			phoneNumber,
			hashedPassword,
			userRole,
			location.id,
		]);
		const newUser: User = newUserResult.rows[0];

		// Generate access and refresh tokens
		const { accessToken, refreshToken } = signTokens({
			_id: newUser.id,
			user_role: userRole,
		});

		// Store refresh token in database
		const updateQuery = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
		await pool.query(updateQuery, [refreshToken, newUser.id]);

		return res
			.status(201)
			.cookie('_refresh_token_', refreshToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24,
				secure: process.env.NODE_ENV === 'production' ? true : false,
				path: '/api/auth/token/refresh',
			})
			.json({
				user_id: newUser.id,
				_access_token_: accessToken,
			});
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const getUserById = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const userQuery =
			'SELECT id, first_name, last_name, email, phone_number, user_role, (SELECT row_to_json(locations) FROM locations WHERE locations.id = users.location_id) AS address, updated_at, created_at FROM users WHERE users.id = $1';
		const userResult = await pool.query(userQuery, [userId]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		const user: User = userResult.rows[0];
		if (!user.parcels) {
			return res.status(200).json(user);
		}
		const remappedUserParcels = {
			...user,
			parcels: user.parcels.map((parcel: Parcel) => {
				const { driver_id, ...parcelInfo } = parcel;
				return parcelInfo;
			}),
		};
		return res.status(200).json(remappedUserParcels);
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const updateUserById = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const { firstName, lastName, email, phoneNumber } = req.body;

	try {
		const userQuery =
			'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE id = $5 RETURNING *';
		const userResult = await pool.query(userQuery, [
			firstName,
			lastName,
			email,
			phoneNumber,
			userId,
		]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		const user: User = userResult.rows[0];
		return res.status(200).json(user);
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const deleteUserById = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const userQuery = 'DELETE FROM users WHERE id = $1 RETURNING *';
		const userResult = await pool.query(userQuery, [userId]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		const user: User = userResult.rows[0];
		return res.status(200).json({ message: `User ${user.id} deleted` });
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const getUserParcels = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const userParcels = await parcelModel.getUserParcels(userId);
		return res.status(200).json(userParcels);
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const getUserParcelById = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const parcelId = req.params.parcelId;

	try {
		const userParcel = await parcelModel.getParcelById(parcelId);
		if (!userParcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		if (userParcel.sender_id !== userId && userParcel.recipient_id !== userId) {
			return res.status(403).json({ message: 'Forbidden access' });
		}
		return res.status(200).json(userParcel);
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
}

export {
	registerUser,
	getUserById,
	updateUserById,
	deleteUserById,
	getUserParcels,
	getUserParcelById,
};

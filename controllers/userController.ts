import 'dotenv/config';
import { Request, Response } from 'express';
import { parcelModel } from 'models/parcels.js';
import { User } from 'schemas/user.js';
import { pool } from '../utils/dbConnect.js';
import { userModel } from 'models/users.js';

const getUserInfo = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const user = await userModel.getUserById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json(user);
	} catch (err) {
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
	} catch (err) {
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
	} catch (err) {
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
		const userParcels = await parcelModel.getParcelsbyUserId(userId);
		if (userParcels.length === 0) {
			return res.status(404).json({ message: 'No parcels found' });
		}
		return res.status(200).json(userParcels);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
};

const getUserParcelInfo = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const parcelId = req.params.parcelId;

	try {
		const userParcel = await parcelModel.getParcelById(parcelId, userId);
		if (!userParcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		return res.status(200).json(userParcel);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Task failed successfully',
			error: 'Internal server error',
			suggestion: 'Please try again later',
		});
	}
}

export {
	getUserInfo,
	updateUserById,
	deleteUserById,
	getUserParcels,
	getUserParcelInfo,
};

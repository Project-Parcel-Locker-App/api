import { hash } from 'bcrypt';
import 'dotenv/config';
import { Request, Response } from 'express';
import { parcelModel } from '../models/parcels.js';
import { userModel } from '../models/users.js';
import { User } from '../schemas/user.js';

const userInfo = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const user = await userModel.getById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Error getting user information',
		});
	}
};

const userParcels = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const userRole = await userModel.getById(userId);
		if (userRole?.user_role === 'driver') {
			const userParcels = await parcelModel.getParcelsByDriverId(userId);
			if (userParcels.length === 0) {
				return res.status(404).json({ message: 'No parcels found' });
			}
			return res.status(200).json(userParcels);
		}
		const userParcels = await parcelModel.getParcelsByUserId(userId);
		if (userParcels.length === 0) {
			return res.status(404).json({ message: 'No parcels found' });
		}
		return res.status(200).json(userParcels);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Error getting user parcels',
		});
	}
};

const userParcelInfo = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const parcelId = req.params.parcelId;

	try {
		const userExists = await userModel.getById(userId);
		if (!userExists) {
			return res.status(404).json({ message: 'User not found' });
		}
		const userParcel = await parcelModel.getParcelById(parcelId);
		if (!userParcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		return res.status(200).json(userParcel);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Error getting user parcel information',
		});
	}
};

const updateUserInfo = async (req: Request, res: Response) => {
	const user: Partial<User> = {
		id: req.params.id,
		first_name: req.body.firstName,
		last_name: req.body.lastName,
		email: req.body.email,
		phone_number: req.body.phoneNumber,
	};

	try {
		if (req.body.password) {
			const password = req.body.password;
			const passwordHash = await hash(password, 12);
			user.password_hash = passwordHash;
		}
		const updatedUser = await userModel.updateById(user);
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json(updatedUser);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Error updating user information',
		});
	}
};

const deleteUserInfo = async (req: Request, res: Response) => {
	const userId = req.params.id;

	try {
		const deletedUser = await userModel.deleteById(userId);
		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.status(200).json({
			message: `User ${deletedUser?.first_name} ${deletedUser?.last_name} with id ${userId} deleted`,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: 'Error deleting user',
		});
	}
};

export {
	userInfo,
	userParcels,
	userParcelInfo,
	updateUserInfo,
	deleteUserInfo,
};

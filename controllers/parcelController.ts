import { Request, Response } from 'express';
import { CustomRequest } from 'middleware/authorization.js';
import { parcelModel } from 'models/parcels.js';
import { userModel } from '../models/users.js';
import { Parcel } from '../schemas/parcel.js';
import { validatePartialParcel } from '../schemas/parcel.js';

const createParcel = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;
		const parcel: Parcel = req.body.parcel;
		const recipientEmail: string = req.body.recipient_email;
		const validation = validatePartialParcel(parcel);
		if (!validation.success) {
			return res.status(400).json({ message: validation.error });
		}
		const recipientId = await userModel.getUserIdByEmail(recipientEmail);
		// Generate sending code ######
		parcel.sending_code = Math.floor(Math.random() * 1000000);
		parcelModel.createParcel(parcel, userId, recipientId);
		return res.status(201).json({ message: 'Parcel created' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error creating new parcel' });
	}
};

const getParcelInfo = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;
		const parcelId = req.params.parcelId;
		const parcel = parcelModel.getParcelById(userId, parcelId);
		if (!parcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		if ((req as CustomRequest).user.user_role !== 'admin') {
			return res.status(403).json({
				message: 'Forbidden',
				error: 'You are not allowed to access this resource',
			});
		}
		return res.status(200).json(parcel);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error getting parcel info' });
	}
};

const updateParcel = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;
		const parcelId = req.params.parcelId;
		const parcel: Partial<Parcel> = req.body.parcel;
		const validation = validatePartialParcel(parcel);
		if (!validation.success) {
			return res.status(400).json({ message: validation.error });
		}
    if (parcel.parcel_status === 'ready_for_pickup') {
      parcel.pickup_code = Math.floor(Math.random() * 1000000);
      parcel.ready_for_pickup_at = 'NOW()'
    }
		const updatedParcel = await parcelModel.updateParcelById(
			userId,
			parcelId,
			parcel,
		);
		if (!updatedParcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		return res.status(200).json(updatedParcel);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error updating parcel' });
	}
};

export { createParcel, getParcelInfo, updateParcel };

import { Request, Response } from 'express';
import { parcelModel } from '../models/parcels.js';
import { generateParcelCode } from '../utils/codeGenerator.js';
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
		const recipientId = await userModel.getIdByEmail(recipientEmail);
		// Generate sending code ####
		parcel.sending_code = generateParcelCode();
		let existingSendingCode = await parcelModel.getBySendingCode(
			parcel.sending_code,
		);
		let existingPickupCode = await parcelModel.getByPickupCode(
			parcel.pickup_code,
		);
		while (existingSendingCode || existingPickupCode) {
			parcel.sending_code = generateParcelCode();
			existingSendingCode = await parcelModel.getBySendingCode(
				parcel.sending_code,
			);
			existingPickupCode = await parcelModel.getByPickupCode(
				parcel.pickup_code,
			);
		}
		const newParcel = await parcelModel.create(parcel, userId, recipientId);
		return res.status(201).json(newParcel);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error creating new parcel' });
	}
};

const getParcelInfo = async (req: Request, res: Response) => {
	try {
		const parcelId = req.params.parcelId;
		const parcel = parcelModel.getParcelById(parcelId);
		if (!parcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		return res.status(200).json(parcel);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error getting parcel info' });
	}
};

const getParcelByCode = async (req: Request, res: Response) => {
	try {
		const parcelCode = req.body.parcel_code;
		if (!parcelCode) {
			return res
				.status(400)
				.json({ message: 'Missing parcel code in the request body' });
		}
		const parcel = await parcelModel.getParcelByCode(parcelCode);
		if (!parcel) {
			return res
				.status(404)
				.json({ message: 'Parcel by the given code not found' });
		}
		return res.status(200).json(parcel);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Error getting parcel info by sending/pickup code' });
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
		if (parcel.parcel_status === 'ready-for-pickup') {
			parcel.pickup_code = generateParcelCode();
			parcel.ready_for_pickup_at = 'NOW()';
			let existingPickupCode = await parcelModel.getByPickupCode(
				parcel.pickup_code,
			);
			let existingSendingCode = await parcelModel.getBySendingCode(
				parcel.pickup_code,
			);
			while (existingPickupCode || existingSendingCode) {
				parcel.pickup_code = generateParcelCode();
				existingPickupCode = await parcelModel.getByPickupCode(
					parcel.pickup_code,
				);
				existingSendingCode = await parcelModel.getBySendingCode(
					parcel.pickup_code,
				);
			}
		}
		console.log(parcelId);
		console.log(parcel);
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

const updateParcelNoUserId = async (req: Request, res: Response) => {
	try {
		const parcelId = req.params.id;
		const parcel: Partial<Parcel> = req.body.parcel;
		const validation = validatePartialParcel(parcel);
		if (!validation.success) {
			return res.status(400).json({ message: validation.error });
		}
		if (parcel.parcel_status === 'ready-for-pickup') {
			parcel.pickup_code = generateParcelCode();
			parcel.ready_for_pickup_at = 'NOW()';
			let existingPickupCode = await parcelModel.getByPickupCode(
				parcel.pickup_code,
			);
			let existingSendingCode = await parcelModel.getBySendingCode(
				parcel.pickup_code,
			);
			while (existingPickupCode || existingSendingCode) {
				parcel.pickup_code = generateParcelCode();
				existingPickupCode = await parcelModel.getByPickupCode(
					parcel.pickup_code,
				);
				existingSendingCode = await parcelModel.getBySendingCode(
					parcel.pickup_code,
				);
			}
		}
		console.log(parcelId);
		console.log(parcel);
		const updatedParcel = await parcelModel.updateParcelNoUserId(
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
}

const deleteParcel = async (req: Request, res: Response) => {
	try {
		const parcelId = req.params.parcelId;
		const deletedParcel = await parcelModel.deleteParcelById(parcelId);
		if (!deletedParcel) {
			return res.status(404).json({ message: 'Parcel not found' });
		}
		return res.status(200).json({ message: 'Parcel deleted' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error deleting parcel' });
	}
};

export {
	createParcel,
	getParcelInfo,
	getParcelByCode,
	updateParcel,
	updateParcelNoUserId,
	deleteParcel,
};

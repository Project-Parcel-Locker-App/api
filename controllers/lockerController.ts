import { Request, Response } from 'express';
import { lockerModel } from '../models/lockers.js';
import { parcelModel } from '../models/parcels.js';
import { Parcel } from '../schemas/parcel.js';

// Locker controller
const getAllLockers = async (_req: Request, res: Response) => {
	try {
		const lockers = await lockerModel.findAll();
		return res.status(200).json({ lockers });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: 'Error trying to retrieve lockers information' });
	}
};

const getLocker = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		if (!Number.isInteger(lockerId)) {
			return res.status(400).json({
				message: 'Locker ID not provided or it has an invalid format',
			});
		}
		const locker = await lockerModel.findById(lockerId);
		if (!locker) {
			return res
				.status(404)
				.json({ message: 'No locker found by the given locker id' });
		}
		return res.status(200).json(locker);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: 'Error trying to retrieve locker information' });
	}
};

const getNearestLockers = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res
				.status(400)
				.json({ message: 'User ID not provided or it has an invalid format' });
		}
		const lockers = await lockerModel.findNearbyByUserId(userId);
		if (lockers.length === 0) {
			res.status(404).json({ message: 'No lockers found near given user id' });
		}
		return res.status(200).json(lockers);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			error: 'Error trying to retrieve the lockers nearby the given user ID',
		});
	}
};

// Cabinet controller
const getAllCabinets = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		if (!Number.isInteger(lockerId)) {
			return res.status(400).json({
				message: 'Locker ID not provided or it has an invalid format',
			});
		}
		const cabinets = await lockerModel.findCabinetsByLockerId(lockerId);
		if (cabinets.length === 0) {
			return res
				.status(404)
				.json({ message: 'No cabinets found by the given locker id' });
		}
		return res.status(200).json({ cabinets });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: "Error by retrieving cabinets' information" });
	}
};

const getCabinetById = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		if (!Number.isInteger(lockerId)) {
			return res.status(400).json({
				message: 'Locker ID not provided or it has an invalid format',
			});
		}
		const cabinetId = parseInt(req.params.cabinetId);
		if (!Number.isInteger(cabinetId)) {
			return res.status(400).json({
				message: 'Cabinet ID not provided or it has an invalid format',
			});
		}
		const cabinet = await lockerModel.findCabinetById(cabinetId, lockerId);
		if (!cabinet) {
			return res
				.status(404)
				.json({ message: 'No cabinet found by the given id' });
		}
		return res.status(200).json({ cabinet });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: 'Internal server error. Please try again later' });
	}
};

const updateCabinet = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		const cabinetId = parseInt(req.params.cabinetId);
		const { parcelId } = req.body;
		if (!Number.isInteger(lockerId) || !Number.isInteger(cabinetId)) {
			return res.status(400).json({
				message:
					'Locker ID or Cabinet ID not provided or it has an invalid format',
			});
		}

		if (!parcelId) {
			const updatedCabinet = await lockerModel.updateCabinetById(
				cabinetId,
				lockerId,
				null,
			);
			if (!updatedCabinet) {
				return res.status(404).json({
					message: 'Cabinet ID not found',
				});
			}
			return res.status(200).json(updatedCabinet);
		}

		const parcel: Parcel | null = await parcelModel.getParcelById(parcelId);
		if (!parcel) {
			return res.status(404).json({
				message: 'Parcel ID not found',
			});
		}
		const updatedCabinet = await lockerModel.updateCabinetById(
			cabinetId,
			lockerId,
			parcelId,
		);
		if (!updatedCabinet) {
			return res.status(404).json({
				message: 'Cabinet ID not found',
			});
		}
		return res.status(200).json(updatedCabinet);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: 'Internal server error when trying to update cabinet' });
	}
};

export {
	getLocker,
	getAllLockers,
	getNearestLockers,
	getAllCabinets,
	getCabinetById,
	updateCabinet,
};

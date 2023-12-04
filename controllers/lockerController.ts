import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../utils/database.js';

const getAllLockers = async (_req: Request, res: Response) => {
	try {
		const sql =
			'SELECT c.locker_id, l.street, l.zip_code, l.city, l.country FROM cabinets c JOIN locations l ON c.location_id = l.id GROUP BY c.locker_id, l.street, l.zip_code, l.city, l.country;';
		const result: QueryResult<Locker> = await pool.query(sql);
		const lockers: Locker[] = result.rows;
		return res.status(200).json({ lockers });
	} catch (err: any) {
		console.error(err.message);
		return res
			.status(500)
			.json({ error: 'Internal server error. Please try again later' });
	}
};

const getLockerById = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		if (!Number.isInteger(lockerId)) {
			return res.status(400).json({
				message: 'Locker ID not provided or it has an invalid format',
			});
		}
		const sql =
			'SELECT c.locker_id, COUNT(c.locker_id) as cabinets_count, l.street, l.zip_code, l.city, l.country, l.latitude as lat, l.longitude as lon FROM cabinets c JOIN locations l ON c.location_id = l.id WHERE c.locker_id = $1 GROUP BY c.locker_id, l.street, l.zip_code, l.city, l.country, l.latitude, l.longitude;';
		const result: QueryResult<Cabinet> = await pool.query(sql, [lockerId]);
		const locker: Locker = result.rows[0];
		if (!locker) {
			return res
				.status(404)
				.json({ message: 'No locker found by the given locker id' });
		}
		return res.status(200).json(locker);
	} catch (err: any) {
		console.error(err.message);
		return res
			.status(500)
			.json({ error: 'Internal server error. Please try again later' });
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
		const distanceQuery = 'SELECT * FROM get_nearest_lockers($1)';

		const result: QueryResult<Locker> = await pool.query(distanceQuery, [
			userId,
		]);
		const lockers: Locker[] = result.rows;
		if (lockers.length === 0) {
			res.status(404).json({ message: 'No lockers found near given user id' });
		}

		// Lockers within a 5km radius
		//const filteredLockers = lockers.filter((locker) => locker.distance < 5.0);

		const fomattedLockers = lockers.map((locker) => {
			return {
				...locker,
				distance: Number(locker.distance.toFixed(2)),
			};
		});
		return res.status(200).json(fomattedLockers);
	} catch (err: any) {
		console.error(err.message);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const getLockerCabinets = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		if (!Number.isInteger(lockerId)) {
			return res.status(400).json({
				message: 'Locker ID not provided or it has an invalid format',
			});
		}
		const sql =
			'SELECT id, cabinet_size, updated_at, (SELECT row_to_json(parcels) FROM parcels WHERE parcels.id = cabinets.parcel_id) as parcel FROM cabinets WHERE locker_id = $1;';
		const result: QueryResult<Cabinet> = await pool.query(sql, [lockerId]);
		const cabinets: Cabinet[] = result.rows;
		if (cabinets.length === 0) {
			return res
				.status(404)
				.json({ message: 'No cabinets found by the given locker id' });
		}
		return res.status(200).json({ cabinets });
	} catch (err: any) {
		console.error(err.message);
		return res
			.status(500)
			.json({ error: 'Internal server error. Please try again later' });
	}
};

const getCabinetById = async (req: Request, res: Response) => {
	try {
		const cabinetId = parseInt(req.params.cabinetId);
		if (!Number.isInteger(cabinetId)) {
			return res.status(400).json({
				message: 'Cabinet ID not provided or it has an invalid format',
			});
		}
		const sql =
			'SELECT id, cabinet_size, updated_at, (SELECT row_to_json(parcels) FROM parcels WHERE parcels.id = cabinets.parcel_id) as parcel FROM cabinets WHERE id = $1;';
		const result: QueryResult<Cabinet> = await pool.query(sql, [cabinetId]);
		const cabinet: Cabinet = result.rows[0];
		if (cabinet === undefined) {
			return res
				.status(404)
				.json({ message: 'No cabinet found by the given cabinet id' });
		}
		return res.status(200).json({ cabinet });
	} catch (err: any) {
		console.error(err.message);
		return res
			.status(500)
			.json({ error: 'Internal server error. Please try again later' });
	}
};

export {
	getLockerById,
	getAllLockers,
	getNearestLockers,
	getLockerCabinets,
	getCabinetById,
};

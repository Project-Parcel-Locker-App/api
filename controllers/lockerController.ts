import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../utils/database.js';

const getLockerById = async (req: Request, res: Response) => {
	try {
		const location_id = parseInt(req.params.id);
		const sql =
			'SELECT id, cabinet_size, (SELECT row_to_json(parcels) FROM parcels WHERE parcels.id = cabinets.parcel_id) as parcel FROM cabinets WHERE locker_id = $1;';
		const result: QueryResult<Cabinet> = await pool.query(sql, [location_id]);
		const cabinets: Cabinet[] = result.rows;
		if (cabinets.length === 0) {
			res.status(404).json({ message: 'No locker found by given id' });
		}
		res.status(200).json({ cabinets });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

const getNearestLocker = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const distanceQuery = 'SELECT * FROM get_nearest_lockers($1)'; // Returns locker_id, coordinates, distance

		const result: QueryResult<Locker> = await pool.query(distanceQuery, [
			userId,
		]);
		const lockers: Locker[] = result.rows;
		if (lockers.length === 0) {
			res.status(404).json({ message: 'No lockers found near given user id' });
		}
		// Show only those within a 5km radius
		const filteredLockers = lockers.filter((locker) => locker.distance < 5.0);
		res.status(200).json(
			filteredLockers.map((locker) => {
				return {
					...locker,
					distance: Number(locker.distance.toFixed(2)),
				};
			}),
		);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

const assignCabinet = async (req: Request, res: Response) => {
	try {
		const lockerId = parseInt(req.params.id);
		const { parcelId, parcelSize } = req.body;

		// Query to find an available cabinet for the specified locker and parcel size
		const cabinetQuery: string =
			'SELECT id FROM cabinets WHERE locker_id = $1 AND cabinet_size = $2 AND parcel_id IS NULL LIMIT 1';
		const cabinetResult: QueryResult<Cabinet> = await pool.query(cabinetQuery, [
			lockerId,
			parcelSize,
		]);
		const cabinetId: number | undefined = cabinetResult.rows[0]?.id;

		// If no cabinet is available
		if (cabinetId === undefined) {
			return res.status(404).json({ error: 'No cabinet with desired size available' });
		}

		// Query to update the cabinet with the specified parcel ID
		const updateQuery: string =
			'UPDATE cabinets SET parcel_id = $1 WHERE id = $2 RETURNING *';
		const updateResult: QueryResult<Cabinet> = await pool.query(updateQuery, [
			parcelId,
			cabinetId,
		]);
		const cabinet: Cabinet = updateResult.rows[0];

		// Update the parcel status to 'in-transit'
		const parcelQuery: string =
			'UPDATE parcels SET parcel_status = $1 WHERE id = $2 RETURNING *';
		await pool.query(parcelQuery, ['in-transit', parcelId]);

		res.status(200).json(cabinet);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

export { getLockerById, getNearestLocker, assignCabinet };

import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../utils/database';

const getLockerById = async (req: Request, res: Response) => {
	try {
		const location_id = parseInt(req.params.id);
		const sql: string =
			'SELECT id, locker_id, cabinet_size, cabinet_status, (SELECT row_to_json(parcels) FROM parcels WHERE parcels.id = cabinets.parcel_id) as parcel FROM cabinets WHERE locker_id = $1;';
		const result: QueryResult<Cabinet> = await pool.query(sql, [location_id]);
		const cabinets: Cabinet[] = result.rows;
		if (cabinets.length === 0) {
			res.status(404).json({ message: 'No locker found by given id' });
			return;
		}
		res.status(200).json({ cabinets });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

const getNearestLocker = async (req: Request, res: Response) => {
	try {
		const user_id: string = req.params.user_id;
		const distanceQuery = 'SELECT * FROM get_nearest_lockers($1)'; // Returns locker_id, location_id, distance

		const result: QueryResult<Locker> = await pool.query(distanceQuery, [
			user_id,
		]);
		const nearest_lockers: Locker[] = result.rows;
		if (nearest_lockers.length === 0) {
			res.status(404).json({ message: 'No lockers found near given user id' });
			return;
		}
		res.status(200).json(
			nearest_lockers.map((locker) => {
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

export { getLockerById, getNearestLocker };

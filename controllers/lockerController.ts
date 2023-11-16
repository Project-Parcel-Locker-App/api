import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../utils/database';

const getLockerById = async (req: Request, res: Response) => {
	try {
		const location_id = parseInt(req.params.id);
		const sql: string = 'SELECT * FROM cabinets WHERE locker_id = $1';
		const result: QueryResult<Cabinet> = await pool.query(sql, [location_id]);
		const cabinets: Cabinet[] = result.rows;
		if (cabinets.length === 0) {
			res.status(404).json({ message: 'No cabinets found by given id' });
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
		const distanceQuery = "SELECT * FROM get_nearest_lockers($1)";

		const result: QueryResult<Locker> = await pool.query(distanceQuery, [user_id]);
		const nearest_cabinets: Locker[] = result.rows;
		if (nearest_cabinets.length === 0) {
			res.status(404).json({ message: 'No cabinets found by given id' });
			return;
		}
		res.status(200).json(
			nearest_cabinets.map((cabinet) => {
				return {
					...cabinet,
					distance: Number(cabinet.distance.toFixed(2)),
				};
			}),
		);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

export { getLockerById, getNearestLocker };

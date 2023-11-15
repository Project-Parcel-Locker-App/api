import { Request, Response } from 'express';
import { pool } from '../utils/database';
import { QueryResult } from 'pg';

const getLockerById = async (req: Request, res: Response) => {
	try {
		const location_id = parseInt(req.params.id);
		const sql: string = 'SELECT * FROM cabinets WHERE location_id = $1';
		const result: QueryResult<Cabinet> = await pool.query(sql, [location_id]);
		const cabinets: Cabinet[] = result.rows;
		if (cabinets.length === 0) {
			res.status(404).json({ message: 'No cabinets found by given id' });
			return;
		}
		res.status(200).json(cabinets);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

export { getLockerById }
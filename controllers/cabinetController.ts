import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../utils/database.js';

const getCabinetById = async (req: Request, res: Response) => {
	try {
		const cabinet_id = parseInt(req.params.id);
		const sql: string = 'SELECT * FROM cabinets WHERE id = $1';
		const result: QueryResult<Cabinet> = await pool.query(sql, [cabinet_id]);
		const cabinet: Cabinet = result.rows[0];
		if (cabinet === undefined) {
			res.status(404).json({ error: 'Cabinet not found' });
			return;
		}
		res.status(200).json(cabinet);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

const reserveCabinet = async (req: Request, res: Response) => {
	try {
		const cabinet_id = parseInt(req.params.id);
		const { parcel_id } = req.body;
		const sql: string =
			"UPDATE cabinets SET cabinet_status = 'reserved', parcel_id = $1 WHERE id = $2 RETURNING *";
		const result: QueryResult<Cabinet> = await pool.query(sql, [
			parcel_id,
			cabinet_id,
		]);
		const cabinet: Cabinet = result.rows[0];
		if (cabinet === undefined) {
			res.status(404).json({ error: 'Cabinet not found' });
			return;
		}
		res.status(200).json(cabinet);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
};

export { getCabinetById, reserveCabinet };

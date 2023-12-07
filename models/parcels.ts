import { QueryResult } from 'pg';
import { Parcel } from '../schemas/parcel.js';
import { pool } from '../utils/dbConnect.js';

const createParcel = async (parcel: Parcel): Promise<Parcel | null> => {
	const query =
		'INSERT INTO parcels (sender_id, recipient_id, size) VALUES ($1, $2, $3) RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [
		parcel.sender_id,
		parcel.recipient_id,
		parcel.parcel_size,
	]);
	return result.rows[0] || null;
};

const getParcelById = async (parcelId: number): Promise<Parcel | null> => {
	const query = 'SELECT * FROM parcels WHERE id = $1';
	const result: QueryResult<Parcel> = await pool.query(query, [parcelId]);
	return result.rows[0] || null;
};

const getUserParcels = async (userId: string): Promise<Parcel[] | []> => {
	const query =
		'SELECT * FROM parcels WHERE (recipient_id = $1 OR sender_id = $1)';
	const result: QueryResult<Parcel> = await pool.query(query, [userId]);
	return result.rows || [];
};

const updateParcel = async (parcel: Parcel): Promise<Parcel | null> => {
	const query =
		'UPDATE parcels SET sender_id = $1, recipient_id = $2, size = $3 WHERE id = $4 RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [
		parcel.sender_id,
		parcel.recipient_id,
		parcel.parcel_size,
		parcel.id,
	]);
	return result.rows[0] || null;
};

const deleteParcel = async (parcelId: number): Promise<Parcel | null> => {
	const query = 'DELETE FROM parcels WHERE id = $1 RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [parcelId]);
	return result.rows[0] || null;
};

export const parcelModel = {
	getParcelById,
	getUserParcels,
	createParcel,
	updateParcel,
	deleteParcel,
};

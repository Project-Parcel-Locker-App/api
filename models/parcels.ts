import { QueryResult } from 'pg';
import { Parcel } from '../schemas/parcel.js';
import { pool } from '../utils/dbConnect.js';

const create = async (
	parcel: Parcel,
	senderId: string,
	recipientId: string | null,
): Promise<Parcel | null> => {
	const query =
		'INSERT INTO parcels (sending_code, parcel_weight, special_instructions, parcel_size, sender_id, recipient_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [
		parcel.sending_code || null,
		parcel.parcel_weight,
		parcel.special_instructions || null,
		parcel.parcel_size,
		// parcel.destination_locker_id,
		senderId,
		recipientId,
	]);
	return result.rows[0] || null;
};

const getBySendingCode = async (
	sendingCode: string,
): Promise<Parcel | null> => {
	const query = 'SELECT id from parcels WHERE sending_code = $1';
	const result: QueryResult<Parcel> = await pool.query(query, [sendingCode]);
	
	return result.rows[0] || null;
};

const getByPickupCode = async (pickupCode: string): Promise<Parcel | null> => {
	const query = 'SELECT id from parcels WHERE pickup_code = $1'
	const result: QueryResult<Parcel> = await pool.query(query, [pickupCode]);

	return result.rows[0] || null;
};

const getParcelById = async (parcelId: string): Promise<Parcel | null> => {
	const query = `
		SELECT 
			parcels.id, sending_code parcel_weight, special_instructions, parcel_size, CONCAT(sender.first_name,' ',sender.last_name) AS sender_full_name, CONCAT(recipient.first_name,' ',recipient.last_name) AS recipient_full_name, parcel_status, ready_for_pickup_at, parcels.updated_at, parcels.created_at,
			CASE
				WHEN cabinets.parcel_id IS NOT NULL THEN row_to_json(locations)
				ELSE NULL
			END AS locker
		FROM parcels 
		LEFT JOIN users AS sender ON parcels.sender_id = sender.id 
		LEFT JOIN users AS recipient ON parcels.recipient_id = recipient.id 
		LEFT JOIN cabinets ON parcels.id = cabinets.parcel_id
		LEFT JOIN locations ON cabinets.location_id = locations.id
		WHERE parcels.id = $1`;
	const result: QueryResult<Parcel> = await pool.query(query, [parcelId]);

	return result.rows[0] || null;
};

const getParcelsByUserId = async (userId: string): Promise<Parcel[] | []> => {
	const query = `
		SELECT 
			parcels.id, parcels.sending_code, parcels.parcel_weight, parcels.special_instructions, parcels.parcel_size,
			CONCAT(sender.first_name,' ',sender.last_name) AS sender_full_name,
			CONCAT(recipient.first_name,' ',recipient.last_name) AS recipient_full_name,
			parcels.parcel_status, parcels.ready_for_pickup_at, parcels.updated_at, parcels.created_at 
		FROM parcels
		LEFT JOIN users AS sender ON parcels.sender_id = sender.id 
		LEFT JOIN users AS recipient ON parcels.recipient_id = recipient.id 
		WHERE (parcels.recipient_id = $1 OR parcels.sender_id = $1)`;
	const result: QueryResult<Parcel> = await pool.query(query, [userId]);
	return result.rows || [];
};

const getParcelsByDriverId = async (
	driverId: string,
): Promise<Parcel[] | []> => {
	const query = `
		SELECT id, parcel_weight, special_instructions, parcel_size, parcel_status, sender_id, recipient_id
		FROM parcels
		WHERE driver_id = $1 AND parcel_status = 'in-transit'`;
	const result: QueryResult<Parcel> = await pool.query(query, [driverId]);
	return result.rows || [];
};

const updateParcelById = async (
	userId: string,
	parcelId: string,
	parcel: Partial<Parcel>,
): Promise<Parcel | null> => {
	const query =
		'UPDATE parcels SET parcel_status = $1, driver_id = $2, pickup_code = $3, ready_for_pickup_at = $4 WHERE id = $5 AND (sender_id = $6 OR recipient_id = $6) RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [
		parcel.parcel_status,
		parcel.driver_id || null,
		parcel.pickup_code || null,
		parcel.ready_for_pickup_at || null,
		parcelId,
		userId,
	]);
	return result.rows[0] || null;
};

const deleteParcelById = async (parcelId: string): Promise<Parcel | null> => {
	const query = 'DELETE FROM parcels WHERE id = $1 RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [parcelId]);
	return result.rows[0] || null;
};

const getAllParcels = async (): Promise<Parcel[] | []> => {
	const query = `
		SELECT 
			parcels.id, sending_code parcel_weight, special_instructions, parcel_size, CONCAT(sender.first_name,' ',sender.last_name) AS sender_full_name, CONCAT(recipient.first_name,' ',recipient.last_name) AS recipient_full_name, parcel_status, ready_for_pickup_at, parcels.updated_at, parcels.created_at,
			CASE
				WHEN cabinets.parcel_id IS NOT NULL THEN row_to_json(locations)
				ELSE NULL
			END AS location
		FROM parcels 
		LEFT JOIN users AS sender ON parcels.sender_id = sender.id 
		LEFT JOIN users AS recipient ON parcels.recipient_id = recipient.id 
		LEFT JOIN cabinets ON parcels.id = cabinets.parcel_id
		LEFT JOIN locations ON cabinets.location_id = locations.id`;
	const result: QueryResult<Parcel> = await pool.query(query);
	return result.rows || [];
};

export const parcelModel = {
	getAllParcels,
	getBySendingCode,
	getByPickupCode,
	getParcelById,
	getParcelsByUserId,
	getParcelsByDriverId,
	create,
	updateParcelById,
	deleteParcelById,
};

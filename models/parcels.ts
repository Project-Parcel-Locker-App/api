import { QueryResult } from 'pg';
import { Parcel } from '../schemas/parcel.js';
import { pool } from '../utils/dbConnect.js';
import {
	generateRandomParcelSize,
	generateRandomSpecialInstructions,
	generateRandomStatus,
} from '../utils/randomParcelProperties.js';
import { userModel } from './users.js';
import { lockerModel} from './lockers.js';

const create = async (
	parcel: Partial<Parcel>,
	senderId: string | null,
	recipientId: string | null,
): Promise<Parcel | null> => {
	const query =
		'INSERT INTO parcels (sending_code, parcel_weight, special_instructions, parcel_size, sender_id, recipient_id, parcel_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [
		parcel.sending_code || null,
		parcel.parcel_weight,
		parcel.special_instructions || null,
		parcel.parcel_size,
		senderId,
		recipientId,
		parcel.parcel_status || null,
	]);
	return result.rows[0] || null;
};

const getParcelByCode = async (code: string | null): Promise<Parcel | null> => {
	const query = `
		SELECT 
			cabinets.locker_id, cabinets.id AS cabinet_id, parcels.id AS parcel_id, sending_code, pickup_code, parcel_weight, special_instructions, parcel_size,
			CONCAT(sender.first_name,' ',sender.last_name) AS sender_full_name, CONCAT(recipient.first_name,' ',recipient.last_name) AS recipient_full_name,
			parcel_status, ready_for_pickup_at, parcels.updated_at, parcels.created_at, row_to_json(locations) AS locker_address
		FROM parcels 
		LEFT JOIN users AS sender ON parcels.sender_id = sender.id 
		LEFT JOIN users AS recipient ON parcels.recipient_id = recipient.id 
		LEFT JOIN cabinets ON parcels.id = cabinets.parcel_id
		LEFT JOIN locations ON cabinets.location_id = locations.id
		WHERE parcels.sending_code = $1 OR parcels.pickup_code = $1`;

	const result: QueryResult<Parcel> = await pool.query(query, [code]);
	return result.rows[0] || null;
};

const getBySendingCode = async (
	sendingCode: string | null,
): Promise<Parcel | null> => {
	const query =
		'SELECT id from parcels	WHERE sending_code = $1 AND parcel_status IS NULL';
	const result: QueryResult<Parcel> = await pool.query(query, [sendingCode]);

	return result.rows[0] || null;
};

const getByPickupCode = async (
	pickupCode: string | null,
): Promise<Parcel | null> => {
	const query = `SELECT id from parcels	WHERE pickup_code = $1 AND parcel_status = 'ready-for-pickup'`;
	const result: QueryResult<Parcel> = await pool.query(query, [pickupCode]);
	return result.rows[0] || null;
};

const getParcelById = async (parcelId: string): Promise<Parcel | null> => {
	const query = `
		SELECT 
			parcels.id, sending_code, pickup_code, parcel_weight, special_instructions, parcel_size, CONCAT(sender.first_name,' ',sender.last_name) AS sender_full_name, CONCAT(recipient.first_name,' ',recipient.last_name) AS recipient_full_name, parcel_status, ready_for_pickup_at, parcels.updated_at, parcels.created_at,
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

const updateParcelNoUserId = async (
	parcelId: string,
	parcel: Partial<Parcel>,
): Promise<Parcel | null> => {
	const query =
		'UPDATE parcels SET parcel_status = $1, driver_id = $2, pickup_code = $3, ready_for_pickup_at = $4 WHERE id = $5 RETURNING *';
	const result: QueryResult<Parcel> = await pool.query(query, [
		parcel.parcel_status,
		parcel.driver_id || null,
		parcel.pickup_code || null,
		parcel.ready_for_pickup_at || null,
		parcelId,
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

const generateParcels = async () => {
	const consumerId = await userModel.getRandomUserId('consumer');
	const companyId = await userModel.getRandomUserId('company');

	const parcel: Partial<Parcel> = {
		// sending_code: generateParcelCode(),
		// pickup_code: generateParcelCode(),
		parcel_weight: Number((Math.random() * 100).toFixed(2)),
		special_instructions: generateRandomSpecialInstructions(),
		parcel_size: generateRandomParcelSize(),
		parcel_status: generateRandomStatus(),
	};

	const newParcel = await create(parcel, consumerId, companyId);
	if (parcel.parcel_status === 'pending') {
		await lockerModel.updateCabinetById(10, 4, newParcel?.id || null);
	}
	return newParcel || null;
};

export const parcelModel = {
	getAllParcels,
	getParcelByCode,
	getBySendingCode,
	getByPickupCode,
	getParcelById,
	getParcelsByUserId,
	getParcelsByDriverId,
	create,
	updateParcelById,
	updateParcelNoUserId,
	deleteParcelById,
	generateParcels,
};

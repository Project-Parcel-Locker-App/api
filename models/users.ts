import { QueryResult } from 'pg';
import { User } from '../schemas/user.js';
import { pool } from '../utils/dbConnect.js';
import { getCoordinates } from '../utils/geolocation.js';

const create = async (user: User): Promise<string | undefined> => {
	const { lat, lon }: { lat: number | undefined; lon: number | undefined } =
		await getCoordinates(
			user.address.street,
			user.address.zip_code,
			user.address.city,
		);

	if (!lat || !lon) {
		return 'Coordinates not found';
	}

	const locationQuery =
		'INSERT INTO locations (street, zip_code, city, country, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
	const locationResult: QueryResult<User> = await pool.query(locationQuery, [
		user.address.street,
		user.address.zip_code,
		user.address.city,
		user.address.country,
		lat,
		lon,
	]);
	user.address.id = locationResult.rows[0]?.id;

	const query =
		'INSERT INTO users (first_name, last_name, email, refresh_token, password_hash, phone_number, user_role, location_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
	const result: QueryResult<User> = await pool.query(query, [
		user.first_name,
		user.last_name,
		user.email,
		user.refresh_token,
		user.password_hash,
		user.phone_number,
		user.user_role,
		user.address.id,
	]);
	
	const newUser = result.rows[0]?.id;
	return newUser || undefined;
};

const getById = async (userId: string): Promise<User | undefined> => {
	const query =
		'SELECT id, first_name, last_name, email, phone_number, user_role, (SELECT row_to_json(locations) FROM locations WHERE locations.id = users.location_id) AS address, updated_at, created_at FROM users WHERE users.id = $1';
	const result: QueryResult<User> = await pool.query(query, [userId]);
	return result.rows[0] || undefined;
};

const getIdByEmail = async (email: string): Promise<string | null> => {
	const query = 'SELECT id FROM users WHERE email = $1';
	const result: QueryResult<User> = await pool.query(query, [email]);
	return result.rows[0]?.id || null;
};

const getRefreshTokenById = async (userId: string): Promise<string | null> => {
	const query = 'SELECT refresh_token FROM users WHERE id = $1';
	const result: QueryResult<User> = await pool.query(query, [userId]);
	return result.rows[0]?.refresh_token || null;
};

const updateById = async (user: Partial<User>): Promise<User | null> => {
	const query =
		'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, password_hash = $5 WHERE id = $7 RETURNING *';
	const result: QueryResult<User> = await pool.query(query, [
		user.first_name,
		user.last_name,
		user.email,
		user.phone_number,
		user.password_hash,
		user.id,
	]);
	return result.rows[0] || null;
};

const updateRefreshTokenById = async (
	userId: string | undefined,
	refreshToken: string,
): Promise<User | null> => {
	const query = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
	const result: QueryResult<User> = await pool.query(query, [
		refreshToken,
		userId,
	]);
	return result.rows[0] || null;
};

const deleteById = async (userId: string): Promise<User | null> => {
	const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
	const result: QueryResult<User> = await pool.query(query, [userId]);
	return result.rows[0] || null;
};

export const userModel = {
	create,
	getById,
	getIdByEmail,
	getRefreshTokenById,
	updateById,
	updateRefreshTokenById,
	deleteById,
};

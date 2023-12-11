import { QueryResult } from 'pg';
import { Cabinet, Locker } from '../schemas/locker.js';
import { pool } from '../utils/dbConnect.js';

// Locker model
const findAll = async () => {
	const sql =
		'SELECT c.locker_id, COUNT(c.locker_id) as cabinets, l.street, l.zip_code, l.city, l.country FROM cabinets c JOIN locations l ON c.location_id = l.id GROUP BY c.locker_id, l.street, l.zip_code, l.city, l.country ORDER BY c.locker_id ASC;';
	const result: QueryResult<Locker[]> = await pool.query(sql);
	return result.rows || [];
};

const findById = async (lockerId: number) => {
	const sql =
		'SELECT c.locker_id, COUNT(c.locker_id) as cabinets, (SELECT COUNT(id) from cabinets where parcel_id IS NULL AND locker_id = $1) AS cabinets_available, l.street, l.zip_code, l.city, l.country, l.latitude as lat, l.longitude as lon FROM cabinets c JOIN locations l ON c.location_id = l.id WHERE c.locker_id = $1 GROUP BY c.locker_id, l.street, l.zip_code, l.city, l.country, l.latitude, l.longitude;';
	const result: QueryResult<Cabinet[]> = await pool.query(sql, [lockerId]);
	return result.rows[0] || null;
};

const findNearbyByUserId = async (userId: string) => {
	const distanceQuery = 'SELECT * FROM get_nearest_lockers($1)';

	const result: QueryResult<Locker[]> = await pool.query(distanceQuery, [
		userId,
	]);
	return result.rows || [];
};

// Cabinet model
const findCabinetsByLockerId = async (lockerId: number) => {
	const sql = `
    SELECT c.id, c.cabinet_size,
      CASE
        WHEN p.id IS NOT NULL THEN
          jsonb_build_object(
            'id', p.id,
            'sender_id', p.sender_id,
            'recipient_id', p.recipient_id,
            'weight', p.parcel_weight,
            'special_instructions', p.special_instructions,
            'size', p.parcel_size,
            'status', p.parcel_status
          )
        ELSE NULL
      END AS parcel
    FROM cabinets c
    LEFT JOIN parcels p ON c.parcel_id = p.id
    WHERE c.locker_id = $1
    ORDER BY c.id ASC;`;  
  const result: QueryResult<Cabinet[]> = await pool.query(sql, [lockerId]);
	return result.rows || [];
};

const findCabinetById = async (cabinetId: number, lockerId: number) => {
	const sql =
		'SELECT id, locker_id, cabinet_size, updated_at, (SELECT row_to_json(parcels) FROM parcels WHERE parcels.id = cabinets.parcel_id) as parcel FROM cabinets WHERE id = $1 AND locker_id = $2;';
	const result: QueryResult<Cabinet> = await pool.query(sql, [cabinetId, lockerId]);
	return result.rows[0] || null;
};

const updateCabinetById = async (cabinetId: number, lockerId: number, parcelId: string | null) => {
  const sql =
    'UPDATE cabinets SET parcel_id = $1 WHERE id = $2 AND locker_id = $3 RETURNING *';
  const result: QueryResult<Cabinet> = await pool.query(sql, [parcelId, cabinetId, lockerId]);
  return result.rows[0] || null;
}

export const lockerModel = {
	findAll,
	findById,
	findNearbyByUserId,
	findCabinetsByLockerId,
  findCabinetById,
  updateCabinetById,
};

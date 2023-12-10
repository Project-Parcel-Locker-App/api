import pg from 'pg';
import { dbConfig } from '../configs/database.js'

const pool = new pg.Pool(dbConfig);

// Test database connection
(async () => {
	try {
		const client = await pool.connect();
		console.log('Connection with the database established 🚀');
		client.release();
	} catch (err: any) {
		throw new Error('Connecting with database failed.', { cause: err });
	}
})();

export { pool };

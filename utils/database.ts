import pg from 'pg'
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
	ssl: process.env.DB_SSL === 'true',
	idleTimeoutMillis: 30000,
};

const pool = new Pool(dbConfig);

// Test database connection
(async () => {
	try {
		const client = await pool.connect();
		console.log('Connection with the database established 🚀');
		client.release();
	} catch (err: any) {
		console.error('Database connection error:', err.message);
	}
})();

export { pool };

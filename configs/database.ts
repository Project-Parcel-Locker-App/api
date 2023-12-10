import 'dotenv/config';

const dbConfig = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
	ssl: process.env.DB_SSL === 'true',
	idleTimeoutMillis: 30000,
};

export { dbConfig };

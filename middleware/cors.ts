import cors from 'cors';
import 'dotenv/config';

class CorsError extends Error {
	status: number;
	constructor(message: string) {
		super(message);
		this.name = 'CorsError';
		this.status = 403;
	}
}

const corsMiddleware = (whitelist: string[], credentials: boolean) =>
	cors({
		origin: (origin, callback) => {
			if (process.env.NODE_ENV === 'production') {
				if (origin && whitelist.includes(origin)) {
					return callback(null, true);
				}
				console.error(`CORS error: Origin ${origin} not allowed`);
				return callback(new CorsError('Origin not allowed'));
			}
			callback(null, true);
		},
		credentials: credentials,
	});

export { corsMiddleware };

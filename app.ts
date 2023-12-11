import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';
// import { ACCEPTED_ORIGINS } from './configs/corsOrigins.js';
// import { corsMiddleware } from './middleware/cors.js';
import { appRouter } from './routes/appRouter.js';

const app: Application = express();

if (process.env.NODE_ENV === 'dev') {
	const morgan = await import('morgan');
	app.use(morgan.default('dev'));
}

app.disable('x-powered-by');
app.use([
	// corsMiddleware(ACCEPTED_ORIGINS, true),
	cors(),
	cookieParser(),
	express.json(),
	express.urlencoded({ extended: false }),
]);

app.use('/api', appRouter);

export { app };

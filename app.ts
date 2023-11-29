import express, { Application } from 'express';
import cors from 'cors';
import { appRouter } from './routes/appRouter.js';

const app: Application = express();
app.disable('x-powered-by');

if (process.env.ENV === 'dev') {
	const morgan = await import('morgan');
	app.use(morgan.default('dev'));
}
app.use([
	cors(),
	express.json(),
	express.urlencoded({ extended: false }),
]);

// Routes
app.use('/api', appRouter);

// Start the server
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

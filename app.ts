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

// Eve's testing
// Serve static files
app.use(express.static('testing')); // directory contains your HTML files
app.post('/login', (_req, res) => {
	res.sendFile(__dirname + '/testing/login.html');
});
app.get('/parcels/history', (_req, res) => {
	res.sendFile(__dirname + '/testing/parcelhistory.html');
});
app.put('/users/userprofile', (_req, res) => {
	res.sendFile(__dirname + '/testing/userprofile.html');
});
app.post('/parcels/send', (_req, res) => {
	res.sendFile(__dirname + '/testing/sendparcel.html');
});

export default app;

// Start the server
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

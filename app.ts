import express, { Application } from 'express';
import cors from 'cors';
import { handle404Error } from 'utils/handle404Error';
import userRouter from './routes/userRoutes';
import parcelRouter from './routes/parcelRoutes';
import cabinetRouter from './routes/cabinetRoutes';

const app: Application = express();
app.disable('x-powered-by');
app.use([
	cors(),
	express.json(), // for parsing application/json
	express.urlencoded({ extended: false }), // for parsing application/x-www-form-urlencoded
]);

// Middleware setup, if needed
// app.use(yourMiddleware);

// Route setup
app.use('/api/users', userRouter);
app.use('/api/parcels', parcelRouter);
app.use('/api/cabinets', cabinetRouter);
app.use('*', handle404Error);

// Start the server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

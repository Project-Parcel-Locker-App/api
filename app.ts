import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import parcelRouter from './routes/parcelRoutes';
import cabinetRouter from './routes/cabinetRoutes';
import { CabinetController } from './controllers/cabinetController';

const app: Application = express();
app.use([
	cors(),
	express.json(), // for parsing application/json
	express.urlencoded({ extended: false }), // for parsing application/x-www-form-urlencoded
]);

app.get('/api', (_req: Request, res: Response) => {
	res.send('Welcome to Express TypeScript Server.');
});

// Middleware setup, if needed
// app.use(yourMiddleware);

// Route setup
app.use('/api/users', userRouter);
app.use('/api/parcels', parcelRouter);
app.use('/api/cabinets', cabinetRouter);

// cabinetRoutes.ts
const router = express.Router();

router.put('/updatestatus', CabinetController.updateStatus);
router.put('/reserve', CabinetController.reserveCabinet);

export default router;




// Start the server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

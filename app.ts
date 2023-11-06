import express, { Request, Response, Application } from 'express';
import userRouter from './routes/userRoutes';
import parcelRouter from './routes/parcelRoutes';
import cabinetRouter from './routes/cabinetRoutes';

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server. Only testing');
});

// Middleware setup, if needed
// app.use(yourMiddleware);

// Route setup
app.use('/api/users', userRouter);
app.use('/api/parcels', parcelRouter);
app.use('/api/cabinets', cabinetRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

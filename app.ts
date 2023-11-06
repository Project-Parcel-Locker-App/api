import express from 'express';
import userRouter from './routes/userRoutes';
import parcelRouter from './routes/parcelRoutes';
import cabinetRouter from './routes/cabinetRoutes';

const app = express();

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

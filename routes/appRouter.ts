import { Router } from 'express';
import { handle404Error } from '../utils/handle404Error.js';
import userRouter from './userRoutes.js';
import parcelRouter from './parcelRoutes.js';
import cabinetRouter from './cabinetRoutes.js';
import { lockerRouter } from './lockerRoutes.js';

const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/parcels', parcelRouter);
appRouter.use('/cabinets', cabinetRouter);
appRouter.use('/lockers', lockerRouter);
appRouter.use('*', handle404Error);

export { appRouter };

import { Router } from 'express';
import { handle404Error } from 'utils/handle404Error';
import userRouter from './userRoutes';
import parcelRouter from './parcelRoutes';
import cabinetRouter from './cabinetRoutes';
import { lockerRouter } from './lockerRoutes';

const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/parcels', parcelRouter);
appRouter.use('/cabinets', cabinetRouter);
appRouter.use('/lockers', lockerRouter);
appRouter.use('*', handle404Error);

export { appRouter };

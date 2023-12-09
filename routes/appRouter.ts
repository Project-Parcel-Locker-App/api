import { Router } from 'express';
// import { authenticateToken } from 'middleware/authorization.js';
import { handle404Error } from '../middleware/handle404Error.js';
import { authRouter } from './authRouter.js';
import cabinetRouter from './cabinetRoutes.js';
import { lockerRouter } from './lockerRoutes.js';
// import { parcelRouter } from './parcelRoutes.js';
import { userRouter } from './userRoutes.js';

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/users', userRouter);
// appRouter.use('/parcels', authenticateToken, parcelRouter);
appRouter.use('/cabinets', cabinetRouter);
appRouter.use('/lockers', lockerRouter);
appRouter.use('*', handle404Error);

export { appRouter };

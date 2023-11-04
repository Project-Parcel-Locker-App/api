import express from 'express';
import { getCabinetStatus, reserveCabinet } from '../controllers/cabinetController';

const cabinetRouter = express.Router();

cabinetRouter.get('/:cabinetID', getCabinetStatus);
cabinetRouter.put('/:cabinetID/reserve', reserveCabinet);

export default cabinetRouter;

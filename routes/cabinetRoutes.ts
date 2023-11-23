// cabinetRoutes.ts
import express from 'express';
import {
	getCabinetById,
	reserveCabinet,
} from '../controllers/cabinetController.js';

const cabinetRouter = express.Router();

cabinetRouter
	.get('/:id', getCabinetById)
	.patch('/:id/reserve', reserveCabinet);

export default cabinetRouter;

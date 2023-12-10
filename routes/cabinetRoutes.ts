// cabinetRoutes.ts
import express from 'express';
import {
	reserveCabinet,
} from '../controllers/cabinetController.js';

const cabinetRouter = express.Router();

cabinetRouter
	.patch('/:id/reserve', reserveCabinet);

export default cabinetRouter;

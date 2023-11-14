// cabinetRoutes.ts
import express from 'express';
import { CabinetController } from '../controllers/cabinetController';

const router = express.Router();

router.put('/updatestatus', CabinetController.updateStatus);
router.put('/reserve', CabinetController.reserveCabinet);

export default router;
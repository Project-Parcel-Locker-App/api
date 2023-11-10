import { Request, Response, NextFunction } from 'express';
import { pool } from '../utils/database';

const cabinetReservationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const cabinetId = req.params.cabinetId; // Extract cabinet ID from the request

  try {
    const checkReservationQuery = 'SELECT reserved FROM cabinets WHERE id = $1';
    const result = await pool.query(checkReservationQuery, [cabinetId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cabinet not found' });
    }

    const cabinet = result.rows[0];
    if (cabinet.reserved) {
      return res.status(400).json({ message: 'Cabinet already reserved' });
    }

    // Cabinet is available for reservation, proceed to the next middleware or route handler
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default cabinetReservationMiddleware;
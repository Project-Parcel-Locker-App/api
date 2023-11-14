import { Request, Response } from 'express';
import { pool } from '../utils/database'; // Import your PostgreSQL pool

export class CabinetController {
  static async updateStatus(req: Request, res: Response) {
    const cabinetId = req.params.cabinetId; // Extract cabinet ID from request
    const { status } = req.body; // Extract new status from the request body

    try {
      const updateQuery = 'UPDATE cabinets SET status = $1 WHERE id = $2 RETURNING *';
      const updatedCabinet = await pool.query(updateQuery, [status, cabinetId]);

      res.json(updatedCabinet.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async reserveCabinet(req: Request, res: Response) {
    const cabinetId = req.params.cabinetId; // Extract cabinet ID from request

    try {
      const reserveQuery = 'UPDATE cabinets SET reserved = TRUE WHERE id = $1 RETURNING *';
      const reservedCabinet = await pool.query(reserveQuery, [cabinetId]);

      res.json(reservedCabinet.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Other methods related to cabinet functionalities
}


import { Request, Response } from 'express';
import { pool } from '../utils/database';

export class ParcelController {
  static sendParcel(req: Request, res: Response) {
    const parcelData = req.body;

    // Example: Inserting parcel data into the database
    pool.query(
      'INSERT INTO parcels (sender, recipient, size) VALUES ($1, $2, $3)',
      [parcelData.sender, parcelData.recipient, parcelData.size],
      (error, /*results*/) => {
        if (error) {
          res.status(500).json({ message: 'Error sending parcel' });
        } else {
          res.status(201).json({ message: 'Parcel sent successfully' });
        }
      }
    );
  }

  static getParcelInfo(req: Request, res: Response) {
    const parcelID = req.params.ParcelID;

    // Example: Retrieving parcel information based on ParcelID
    pool.query('SELECT * FROM parcels WHERE id = $1', [parcelID], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error fetching parcel information' });
      } else {
        res.json(results.rows);
      }
    });
  }

  static updateParcelStatus(req: Request, res: Response) {
    const parcelID = req.params.ParcelID;
    const { status } = req.body;

    // Example: Updating parcel status based on ParcelID
    pool.query('UPDATE parcels SET status = $1 WHERE id = $2', [status, parcelID], (error, /*results*/) => {
      if (error) {
        res.status(500).json({ message: 'Error updating parcel status' });
      } else {
        res.json({ message: 'Parcel status updated' });
      }
    });
  }
}

export default ParcelController;

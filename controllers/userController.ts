import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { pool } from '../utils/database';

dotenv.config();

export class UserController {
  // Generate access token
  static generateAccessToken(user: any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '14min' });
  }

  // Generate refresh token
  static generateRefreshToken(user: any) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '30min' });
  }

  static registerUser(req: Request, res: Response) {
    // Implement user registration logic
    const { username, email, password } = req.body;

    // Your registration logic to save the user to the database

    const user = { username, email, password }; // Mock user for token generation
    const accessToken = UserController.generateAccessToken(user);
    const refreshToken = UserController.generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  }

  static loginUser(req: Request, res: Response) {
    // Implement user authentication logic
    const { email, password } = req.body;

    // Your authentication logic to validate the user

    const user = { email, password }; // Mock user for token generation

    const accessToken = UserController.generateAccessToken(user);
    const refreshToken = UserController.generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  }
// Underscore
  static logoutUser(_req: Request, res: Response) {
    // Log out: Typically, for token-based authentication, the server doesn't store tokens.
    // Logging out involves invalidating or deleting the refresh token on the client side.

    // Implement user logout logic
    res.json({ message: 'Logged out successfully' });
  }

  
  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
  
    try {
      const userQuery = 'SELECT id, first_name, last_name, email, phone_number, updated_at, created_at, (SELECT json_agg(parcels) FROM parcels WHERE parcels.sender_id = users.id OR parcels.recipient_id = users.id) AS parcels FROM users WHERE users.id = $1';
      const userResult = await pool.query(userQuery, [userId]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = userResult.rows[0];
      const remappedUserParcels = {
        ...user,
        parcels: user.parcels.map((parcel: Parcel) => {
          const { driver_id, ...parcelInfo } = parcel;
          return parcelInfo;
        }),
      };
      return res.status(200).json(remappedUserParcels);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
  

  static refreshToken(req: Request, res: Response) {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret, (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      const accessToken = UserController.generateAccessToken({ email: user.email });
      res.json({ accessToken });
      return;
    });

    return res.sendStatus(500);
  }
}

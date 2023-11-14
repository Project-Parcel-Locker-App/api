import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { pool } from '../utils/database';
import dotenv from 'dotenv';

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

  
  static async getUserInfo(req: Request, res: Response) {
    const userId = req.params.id;
  
    try {
      // Fetch user information
      const userQuery = 'SELECT * FROM users WHERE id = $1';
      const userResult = await pool.query(userQuery, [userId]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = userResult.rows[0]; // Retrieve user details
  
      // Fetch parcel history linked to the user
      const parcelQuery = 'SELECT * FROM parcels WHERE sender_id = $1 OR recipient_id = $1';
      const parcelResult = await pool.query(parcelQuery, [userId]);
  
      const parcelHistory = parcelResult.rows;
  
      const userInfo = {
        user,
        parcelHistory,
        // Include any other user-related information here
      };
  
      return res.status(200).json(userInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving user information' });
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

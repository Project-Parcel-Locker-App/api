import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { pool } from '../utils/database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export class UserController {

  // Generate refresh token
  static generateRefreshToken(user: any) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '30min' });
  }

  static async registerUser(req: Request, res: Response) {
    // Implement user registration logic
    const { password,
      email,
      firstName,
      lastName,
      phoneNumber,
      addressLine1,
      city,
      country,
      zipCode,
    } = req.body;
    const role = 'consumer'
    // Your registration logic to save the user to the database

    const user = {
      email,
      firstName,
      lastName,
      phoneNumber,
      addressLine1,
      city,
      country,
      zipCode,
      role
    }; // Mock user for token generation
    const salt = 10
    const hashedPassword = await bcrypt.hash(password, salt);

    pool.query(
      'INSERT INTO users (first_name, last_name, email, password_salt, password_hash, user_role, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [firstName, lastName, email, salt, hashedPassword, role, phoneNumber],
      (error, results) => {
        if (error) {
          res.status(500).json({ message: error });
        } else {
          console.log('results', results.rows)
          const token = UserController.generateRefreshToken({ role, email });
          res.json({ token });
        }
      }
    );
    console.log('user', user)

  }

  static async loginUser(req: Request, res: Response) {
    // Implement user authentication logic
    const { email, password } = req.body;
    console.log('email', email)
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, userResult.rows[0].password_hash);

    if (passwordMatch) {
      // Passwords match, authentication successful
      const token = UserController.generateRefreshToken({role: userResult.rows[0].user_role, email});
      res.status(200).json({ token });
    } else {
      // Passwords do not match, authentication failed
      res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
    }
    // Your authentication logic to validate the user

    // 

    // res.json({ token });
  }
  // Underscore


  static async getUserInfo(req: Request, res: Response) {
    const userId = req.query.id;
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

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error retrieving user information' });
    }
  }

}

import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class UserController {
  // Existing method to generate access token
  static generateAccessToken(user: any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '15m' });
  }

  // Existing method to generate refresh token
  static generateRefreshToken(user: any) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret);
  }

  static registerUser(req: Request, res: Response) {
    // Implement user registration logic here
    const { username, email, password } = req.body;

    // Your registration logic to save the user to the database

    const user = { username, email, password }; // Mock user for token generation
    const accessToken = UserController.generateAccessToken(user);
    const refreshToken = UserController.generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  }

  static loginUser(req: Request, res: Response) {
    // Implement user authentication logic here
    const { email, password } = req.body;

    // Your authentication logic to validate the user

    const user = { email, password }; // Mock user for token generation
    const accessToken = UserController.generateAccessToken(user);
    const refreshToken = UserController.generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  }

  // !
  static getUserInfo(req: Request, res: Response) {
    // Get user information based on authentication
    const userProfile = req.user;
    //{ /* retrieve user profile based on authentication */};

    res.json(userProfile);
  }

  // Existing method to refresh access token
  static refreshToken(req: Request, res: Response) {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret, (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      const accessToken = UserController.generateAccessToken({ email: user.email });
      res.json({ accessToken });
      return;
    });

    return res.sendStatus(500); // Return an error if the function doesn't return earlier
  }
};
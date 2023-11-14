import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class UserController {
  // Existing method to generate access token
  static generateAccessToken(user: any) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  }

  // Existing method to generate refresh token
  static generateRefreshToken(user: any) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  }

  static registerUser(req: Request, res: Response) {
    // Implement user registration logic here
    const { username, email, password } = req.body;

    // Your registration logic to save the user to the database

    const user = { username, email }; // Mock user for token generation
    const accessToken = UserController.generateAccessToken(user);
    const refreshToken = UserController.generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  }

  static loginUser(req: Request, res: Response) {
    // Implement user authentication logic here
    const { email, password } = req.body;

    // Your authentication logic to validate the user

    const user = { email }; // Mock user for token generation
    const accessToken = UserController.generateAccessToken(user);
    const refreshToken = UserController.generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  }

  // ! UNDERSCORE !
  static getUserInfo(_req: Request, res: Response) {
    // Get user information based on authentication
    const userProfile = { /* retrieve user profile based on authentication */ };
    res.json(userProfile);
  }

  // Existing method to refresh access token
  static refreshToken(req: Request, res: Response) {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      const accessToken = UserController.generateAccessToken({ email: user.email });
      res.json({ accessToken });
    });
  }
};
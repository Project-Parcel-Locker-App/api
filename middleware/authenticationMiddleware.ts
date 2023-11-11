import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Access token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret); // Verify the token
    // Add decoded user information to the request object if needed
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid access token' });
  }
};


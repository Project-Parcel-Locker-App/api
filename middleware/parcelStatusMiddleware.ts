// NOTICE: _res means it's not used. To use it, remove underscore

import { Request, Response, NextFunction } from 'express';

export const parcelStatusMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const { status } = req.body; // Extract the new status from the request

  // Check conditions to allow status update
  if (status === 'delivered') {
    // Your specific conditions for status update

    // Allow the status update
    next();
  } else {
    // Handle other cases or conditions, or send a response
    // For instance, if the status is not 'delivered', you might want to return an error response
    _res.status(400).json({ message: 'Invalid status for update' });
  }
};


import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiErrors'; // adjust the path to your ApiError class

// Error-handling middleware
const errorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    // Handle ApiError
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: !!err.errors ? err.errors : undefined, // Include errors array if there are errors
    });
  } else {
    // Handle any other error (fallback error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errors: err.message ? err.message : undefined,
    });
  }
};

export default errorHandler;

import { ExpressRequestInterface } from 'models/expressRequest.interface';
import User from '../models/user.model';
import { ApiError } from '../utils/ApiErrors';
import asyncHandler from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

export const verifyJWT = asyncHandler(
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      if (!accessToken) throw new ApiError(401, 'UnAuthorized Request');

      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as { _id: string; email: string; username: string; fullname: string };

      const user = await User.findById(decoded?._id).select(
        '-password -refreshToken',
      );

      if (!user) throw new ApiError(401, 'Invalid Access Token');

      req.user = user;
      next();
    } catch (error) {
      const message = (error as Error).message;
      throw new ApiError(401, message || 'Invalid Access Token');
    }
  },
);

// Fix Issues: Use JS for a while
// import { Request, Response, NextFunction } from 'express';
// import { User } from '../models/user.model';
// import ApiError from '../utils/ApiError';
// import asyncHandler from '../utils/asyncHandler';
// import jwt, { JwtPayload } from 'jsonwebtoken';

// // Define a type for the JWT payload
// interface DecodedToken extends JwtPayload {
//   _id: string; // Add other fields if needed
// }

// export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const accessToken =
//       req.cookies?.accessToken ||
//       req.header('Authorization')?.replace('Bearer ', '');

//     if (!accessToken) throw new ApiError(401, 'Unauthorized Request');

//     // Verify the token and cast it to the DecodedToken type
//     const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as DecodedToken;

//     const user = await User.findById(decoded?._id).select('-password -refreshToken');

//     if (!user) throw new ApiError(401, 'Invalid Access Token');

//     req.user = user; // You may want to define a custom user type for the req object
//     next();
//   } catch (error) {
//     throw new ApiError(401, error?.message || 'Invalid Access Token');
//   }
// });

import { Document } from 'mongoose';

export interface User {
  username: string;
  fullname: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
}

export interface UserDocument extends User, Document {
  validatePassword(password: string): Promise<any>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

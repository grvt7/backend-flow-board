import { Document } from 'mongoose';

export interface User {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export interface UserDocument extends User, Document {
  validatePassword(param1: string): string;
}

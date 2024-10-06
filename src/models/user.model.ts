import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDocument } from './user.types';
import validator from 'validator';
import { ApiError } from '../utils/ApiErrors';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is Required'],
      validate: [validator.isEmail, 'Invalid Email'],
      createIndexes: { unique: true },
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, 'Fullname is Required'],
    },
    username: {
      type: String,
      required: [true, 'Username is Required'],
      lowercase: true,
      createIndexes: { unique: true },
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      select: false,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const saltOrRound = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltOrRound);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new ApiError(404, 'ACCESS TOKEN SECRET NOT FOUND!!');
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new ApiError(404, 'REFRESH TOKEN SECRET NOT FOUND!!');
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;

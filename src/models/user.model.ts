import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDocument } from './user.types';
import validator from 'validator';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is Required'],
      validate: [validator.isEmail, 'Invalid Email'],
      createIndexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, 'Username is Required'],
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      select: false,
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

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;

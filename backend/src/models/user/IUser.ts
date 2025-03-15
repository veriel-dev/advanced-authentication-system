import { Document } from 'mongoose';
export interface IUser extends Document {
  email: string
  password: string
  name: string
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date
  isVerified: boolean
  resetPasswordToken?: string
  resetPasswordExpiresAt?: Date
  verificationToken?: string,
  verificationTokenExpiresAt?: Date
}
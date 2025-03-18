import { Document } from 'mongoose';
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiresAt?: number;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
}

import mongoose from 'mongoose';
import { IUser } from '../entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: mongoose.Types.ObjectId): Promise<IUser | null>;
  findByVerificationToken(token: string, validTime: number): Promise<IUser | null>;
  findByResetPasswordToken(token: string, validTime: number): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
}

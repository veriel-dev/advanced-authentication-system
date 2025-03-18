import { Response } from 'express';
import mongoose from 'mongoose';

export interface AuthService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
  generateVerificationCode(): string;
  generateResetToken(): string;
  generateTokenAndSetCookie(res: Response, userId: mongoose.Types.ObjectId): void;
}

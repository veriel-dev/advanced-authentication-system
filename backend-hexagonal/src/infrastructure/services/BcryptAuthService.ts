import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Response } from 'express';

import { generateTokenAndSetCookie } from '../../utils/generate-token-and-set-cookie';
import { generaeVerificationCode } from '../../utils/generate-verification-code';
import { AuthService } from '../../domain/services/AuthService';

export class BcryptAuthService implements AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateVerificationCode(): string {
    return generaeVerificationCode();
  }

  generateResetToken(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  generateTokenAndSetCookie(res: Response, userId: mongoose.Types.ObjectId): void {
    generateTokenAndSetCookie(res, userId as unknown as mongoose.Types.ObjectId);
  }
}

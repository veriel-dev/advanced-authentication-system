import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthService } from '../../domain/services/AuthService';
import { EmailService } from '../../domain/services/EmailService';
import { ONE_HOUR, TWENTY_FOUR_HOURS } from '../../infrastructure/config/constants';
import User from '../../domain/entities/User';
import { Response } from 'express';
import mongoose from 'mongoose';
import { cookie } from 'express-validator';

export class AuthenticationService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private emailService: EmailService,
  ) { }

  async register(userData: { email: string; password: string; name: string }, res: Response) {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      return {
        success: false,
        code: 'BAD_REQUEST',
        message: 'User already exists',
      };
    }

    const hashedPassword = await this.authService.hashPassword(userData.password);
    const verificationToken = this.authService.generateVerificationCode();

    const user = new User({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + TWENTY_FOUR_HOURS,
    });

    const savedUser = await this.userRepository.save(user);

    this.authService.generateTokenAndSetCookie(res, savedUser._id);
    await this.emailService.sendVerificationEmail(userData.email, verificationToken);

    return {
      success: true,
      code: 'CREATED',
      message: 'User created successfully',
      user: savedUser
    };
  }

  async verifyEmail(code: string) {
    const user = await this.userRepository.findByVerificationToken(code, Date.now());

    if (!user) {
      return {
        success: false,
        code: 'BAD_REQUEST',
        message: 'Invalid verification code',
      };
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user.email);

    return {
      success: true,
      code: 'CREATED',
      message: 'Email verified successfully',
      user
    };
  }

  async login(credentials: { email: string; password: string }, res: Response) {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      return {
        success: false,
        code: 'BAD_REQUEST',
        message: 'User not found',
      };
    }

    const isPasswordCorrect = await this.authService.comparePasswords(
      credentials.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return {
        success: false,
        code: 'BAD_REQUEST',
        message: 'Invalid password',
      };
    }
    this.authService.generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await this.userRepository.save(user);

    return {
      success: true,
      code: 'OK',
      message: 'Login successful',
      user
    };
  }

  async forgotPassword(email: string, clientUrl: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        success: false,
        code: 'BAD_REQUEST',
        message: 'User not found',
      };
    }

    const resetToken = this.authService.generateResetToken();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + ONE_HOUR;

    await this.userRepository.save(user);
    await this.emailService.sendResetPasswordEmail(
      user.email,
      `${clientUrl}/reset-password/${resetToken}`,
    );

    return {
      success: true,
      code: 'CREATED',
      message: 'Reset password email sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findByResetPasswordToken(token, Date.now());

    if (!user) {
      return {
        success: false,
        code: 'BAD_REQUEST',
        message: 'Invalid or expired reset password token',
      };
    }

    const hashedPassword = await this.authService.hashPassword(newPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await this.userRepository.save(user);
    await this.emailService.sendResetSuccessEmail(user.email);

    return {
      success: true,
      code: 'OK',
      message: 'Password reset successfully',
    };
  }

  async checkAuth(userId: mongoose.Types.ObjectId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      };
    }
    return {
      success: true,
      code: 'OK',
      message: 'Login successful',
      user,
    };
  }

  logout(res: Response) {


    res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      maxAge: -1
    });

    // Método 2: Forzar expiración con clearCookie
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
      path: '/'
    });

    // Método 3: Establecer encabezado directo
    res.setHeader('Set-Cookie',
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict' +
      (process.env.NODE_ENV !== 'development' ? '; Secure' : '')
    );

    console.log({
      cookie: res.get('Set-Cookie')
    });

    return {
      success: true,
      code: 'OK',
      message: 'Logout successful',
    };
  }
}

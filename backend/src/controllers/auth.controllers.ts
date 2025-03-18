import User from '../models/user/user.model';
import { register as registerMessages, HtttpStatus } from '../config/messages';
import { Request, Response } from 'express';
import ResponseBuilder from '../utils/responde-builder';
import bcrypts from 'bcryptjs';
import { generaeVerificationCode } from '../utils/generate-verification-code';
import { ONE_HOUR, TWENTY_FOUR_HOURS } from '../config/constants';
import { generateTokenAndSetCookie } from '../utils/generate-token-and-set-cookie';
import mongoose from 'mongoose';
import {
  sendResetPasswordEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../nodemailer/emails';
import crypto from 'crypto';
import { config } from '../config/config';
import { RequestWithUserId } from '../middleware/verifytoken.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      ResponseBuilder.send(
        res,
        HtttpStatus.BAD_REQUEST,
        false,
        registerMessages.wrong.userAlreadyExists,
      );
      return;
    }
    const hashedPassword = await bcrypts.hash(password, 10);

    const verificationToken = generaeVerificationCode();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + TWENTY_FOUR_HOURS,
    });
    await user.save();
    // jwt and set Cookies
    generateTokenAndSetCookie(res, user._id as mongoose.Types.ObjectId);
    await sendVerificationEmail(email, verificationToken);
    ResponseBuilder.send(
      res,
      HtttpStatus.CREATED,
      true,
      registerMessages.wrong.userCreatedsuccesfully,
    );
  } catch (error) {
    console.log(`${registerMessages.wrong.internalServerError} - ${error}`);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      registerMessages.wrong.internalServerError,
    );
    return;
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      ResponseBuilder.send(
        res,
        HtttpStatus.BAD_REQUEST,
        false,
        registerMessages.wrong.invalidVerificationCode,
      );
      return;
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email);
    ResponseBuilder.send(
      res,
      HtttpStatus.CREATED,
      true,
      registerMessages.wrong.emailVerifiedSuccesfully,
    );
  } catch (error) {
    console.log(`${registerMessages.wrong.internalServerError} - ${error}`);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      registerMessages.wrong.internalServerError,
    );
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      ResponseBuilder.send(
        res,
        HtttpStatus.BAD_REQUEST,
        false,
        registerMessages.wrong.userNotFound,
      );
      return;
    }
    const isPasswordCorrect = await bcrypts.compare(password, user.password);

    if (!isPasswordCorrect) {
      ResponseBuilder.send(
        res,
        HtttpStatus.BAD_REQUEST,
        false,
        registerMessages.wrong.invalidPassword,
      );
      return;
    }
    generateTokenAndSetCookie(res, user._id as mongoose.Types.ObjectId);
    user.lastLogin = new Date();
    await user.save();

    ResponseBuilder.send(res, HtttpStatus.OK, true, registerMessages.success.logInSuccesfully);
  } catch (error) {
    console.log(`${registerMessages.wrong.internalServerError} - ${error}`);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      registerMessages.wrong.internalServerError,
    );
    return;
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      ResponseBuilder.send(
        res,
        HtttpStatus.BAD_REQUEST,
        false,
        registerMessages.wrong.userNotFound,
      );
      return;
    }
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordTokenExpiresAt = Date.now() + ONE_HOUR;
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordTokenExpiresAt;
    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${config.clientUrl}/reset-password/${resetPasswordToken}`,
    );

    ResponseBuilder.send(
      res,
      HtttpStatus.CREATED,
      true,
      registerMessages.success.resetPasswordEmailSent,
    );
  } catch (error) {
    console.log(`${registerMessages.wrong.internalServerError} - ${error}`);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      registerMessages.wrong.internalServerError,
    );
    return;
  }
};
export const logOut = (req: Request, res: Response) => {
  res.clearCookie('token');
  ResponseBuilder.send(res, HtttpStatus.OK, true, registerMessages.success.logOutSuccesfully);
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      ResponseBuilder.send(
        res,
        HtttpStatus.BAD_REQUEST,
        false,
        registerMessages.wrong.invalidOrExpiredResetTokenPassword,
      );
      return;
    }
    const hashedPassword = await bcrypts.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    ResponseBuilder.send(
      res,
      HtttpStatus.OK,
      true,
      registerMessages.success.passwordResetSuccesfully,
    );
  } catch (error) {
    console.log(`${registerMessages.wrong.internalServerError} - ${error}`);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      registerMessages.wrong.internalServerError,
    );
    return;
  }
};
export const checkAuth = async (req: RequestWithUserId, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select('-password');
    if (!user) {
      ResponseBuilder.send(
        res,
        HtttpStatus.UNAUTHORIZED,
        false,
        registerMessages.wrong.unauthorized,
      );
      return;
    }
    ResponseBuilder.send(res, HtttpStatus.OK, true, registerMessages.success.logInSuccesfully, {
      user,
    });
  } catch (error) {
    console.log(`${registerMessages.wrong.internalServerError} - ${error}`);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      registerMessages.wrong.internalServerError,
    );
    return;
  }
};

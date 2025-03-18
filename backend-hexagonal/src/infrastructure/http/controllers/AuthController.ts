import { Request, Response } from 'express';
import { config } from '../../config/config';
import { HtttpStatus, messages } from '../../config/messages';
import { RequestWithUserId } from '../middleware/verifytoken.middleware';
import ResponseBuilder from '../../../utils/responde-builder';
import { AuthenticationService } from '../../../application/services/AuthenticationService';
import mongoose from 'mongoose';

export class AuthController {
  constructor(private authenticationService: AuthenticationService) {}
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const result = await this.authenticationService.register({ email, password, name }, res);
      const statusCodeKey = result.code as keyof typeof HtttpStatus;

      ResponseBuilder.send(
        res,
        HtttpStatus[statusCodeKey],
        result.success,
        result.success ? messages.success.userCreatedsuccesfully : result.message,
      );
    } catch (error) {
      console.log(`${messages.wrong.internalServerError} : ${error}`);
      ResponseBuilder.send(
        res,
        HtttpStatus.INTERNAL_SERVER_ERROR,
        false,
        messages.wrong.internalServerError,
      );
    }
  }
  async verifyEmail(req: Request, res: Response) {
    try {
      const { code } = req.body;

      const result = await this.authenticationService.verifyEmail(code);
      const statusCodeKey = result.code as keyof typeof HtttpStatus;

      ResponseBuilder.send(
        res,
        HtttpStatus[statusCodeKey],
        result.success,
        result.success ? messages.success.emailVerifiedSuccesfully : result.message,
      );
    } catch (error) {
      console.log(`${messages.wrong.internalServerError}:  ${error}`);
      ResponseBuilder.send(
        res,
        HtttpStatus.INTERNAL_SERVER_ERROR,
        false,
        messages.wrong.internalServerError,
      );
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await this.authenticationService.login({ email, password }, res);
      const statusCodeKey = result.code as keyof typeof HtttpStatus;

      ResponseBuilder.send(
        res,
        HtttpStatus[statusCodeKey],
        result.success,
        result.success ? messages.success.logInSuccesfully : result.message,
      );
    } catch (error) {
      console.log(`${messages.wrong.internalServerError}:  ${error}`);
      ResponseBuilder.send(
        res,
        HtttpStatus.INTERNAL_SERVER_ERROR,
        false,
        messages.wrong.internalServerError,
      );
    }
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const result = await this.authenticationService.forgotPassword(email, config.clientUrl);
      const statusCodeKey = result.code as keyof typeof HtttpStatus;

      ResponseBuilder.send(
        res,
        HtttpStatus[statusCodeKey],
        result.success,
        result.success ? messages.success.resetPasswordEmailSent : result.message,
      );
    } catch (error) {
      console.log(`${messages.wrong.internalServerError}:  ${error}`);
      ResponseBuilder.send(
        res,
        HtttpStatus.INTERNAL_SERVER_ERROR,
        false,
        messages.wrong.internalServerError,
      );
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const result = await this.authenticationService.resetPassword(token, password);
      const statusCodeKey = result.code as keyof typeof HtttpStatus;
      ResponseBuilder.send(
        res,
        HtttpStatus[statusCodeKey],
        result.success,
        result.success ? messages.success.passwordResetSuccesfully : result.message,
      );
    } catch (error) {
      console.log(`${messages.wrong.internalServerError}:  ${error}`);
      ResponseBuilder.send(
        res,
        HtttpStatus.INTERNAL_SERVER_ERROR,
        false,
        messages.wrong.internalServerError,
      );
    }
  }
  async checkAuth(req: RequestWithUserId, res: Response) {
    try {
      const result = await this.authenticationService.checkAuth(req.userId as mongoose.Types.ObjectId);
      const user = result.user;


      const statusCodeKey = result.code as keyof typeof HtttpStatus;

      ResponseBuilder.send(
        res,
        HtttpStatus[statusCodeKey],
        true,
        messages.success.logInSuccesfully,
        { user: user?.toObject() }
      );
    } catch (error) {
      console.log(`${messages.wrong.internalServerError} : ${error}`);
      ResponseBuilder.send(
        res,
        HtttpStatus.INTERNAL_SERVER_ERROR,
        false,
        messages.wrong.internalServerError,
      );
    }
  }
  async logout(req: Request, res: Response) {
    const result = this.authenticationService.logout(res);
    const statusCodeKey = result.code as keyof typeof HtttpStatus;
    ResponseBuilder.send(
      res,
      HtttpStatus[statusCodeKey],
      result.success,
      messages.success.logOutSuccesfully,
    );
  }
}

import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { HtttpStatus, messages } from '../../config/messages';
import { config } from '../../config/config';
import ResponseBuilder from '../../../utils/responde-builder';
import mongoose from 'mongoose';

export interface RequestWithUserId extends Request {
  userId: mongoose.Types.ObjectId;
}
export const verifyToken = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      ResponseBuilder.send(res, HtttpStatus.UNAUTHORIZED, false, messages.wrong.unauthorized);
      return;
    }
    const decodedToken = jwt.verify(token, config.jwtSecret) as { userId: mongoose.Types.ObjectId };
    if (!decodedToken) {
      ResponseBuilder.send(res, HtttpStatus.UNAUTHORIZED, false, messages.wrong.unauthorized);
      return;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.log(error);
    ResponseBuilder.send(
      res,
      HtttpStatus.INTERNAL_SERVER_ERROR,
      false,
      messages.wrong.internalServerError,
    );
    return;
  }
};

import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HtttpStatus, register } from "../config/messages";
import { config } from "../config/config";
import ResponseBuilder from "../utils/responde-builder";


export interface RequestWithUserId extends Request {
  userId: string;
}
export const verifyToken = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      ResponseBuilder.send(res, HtttpStatus.UNAUTHORIZED, false, register.wrong.unauthorized)
      return
    }
    const decodedToken = jwt.verify(token, config.jwtSecret) as { userId: string };
    if (!decodedToken) {
      ResponseBuilder.send(res, HtttpStatus.UNAUTHORIZED, false, register.wrong.unauthorized)
      return
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    ResponseBuilder.send(res, HtttpStatus.INTERNAL_SERVER_ERROR, false, register.wrong.internalServerError)
    return
  }
};
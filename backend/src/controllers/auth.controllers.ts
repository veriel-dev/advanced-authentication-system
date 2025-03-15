import User from "../models/user/user.model";
import { register as registerMessages, HtttpStatus } from '../config/messages';
import { Request, Response } from "express"
import ResponseBuilder from "../utils/responde-builder";
import bcrypts from "bcryptjs"
import { generaeVerificationCode } from "../utils/generate-verification-code";
import { TWENTY_FOUR_HOURS } from "../config/constants";
import { generateTokenAndSetCookie } from "../utils/generate-token-and-set-cookie";
import mongoose from "mongoose";


export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      ResponseBuilder.send(res, HtttpStatus.BAD_REQUEST, false, registerMessages.wrong.userAlreadyExists)
      return
    }
    const hashedPassword = await bcrypts.hash(password, 10);
    
    const verificationToken = generaeVerificationCode();

    console.log({hashedPassword, verificationToken})
    const user = new User({ 
      email, 
      password: hashedPassword, 
      name, 
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + TWENTY_FOUR_HOURS
    })
    await user.save()
    // jwt and set Cookies
    generateTokenAndSetCookie(res, user._id as mongoose.Types.ObjectId)
    ResponseBuilder.send(res, HtttpStatus.CREATED, true, registerMessages.wrong.userCreatedsuccesfully)

  } catch (error) {
    console.log(error)
    ResponseBuilder.send(res, HtttpStatus.INTERNAL_SERVER_ERROR, false, registerMessages.wrong.internalServerError)
    return
  }
}

export const login = (req: Request, res: Response) => {
  res.send("Login route")
}

export const logOut = (req: Request, res: Response) => {
  res.send("LogOut route")
}
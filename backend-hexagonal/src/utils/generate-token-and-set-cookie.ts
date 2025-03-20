import { Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../infrastructure/config/config';

export const generateTokenAndSetCookie = (res: Response, userId: mongoose.Types.ObjectId) => {
  const token = jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: '7d',
  });
  res.cookie('token', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: 'strict', // CSRF attacks croos-site request forqery attacks
    secure: process.env.NODE_ENV !== 'development',
  });
  return token;
};

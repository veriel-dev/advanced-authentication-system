import { validate } from '../../middleware/validate.middleware';
import {
  register,
  logOut,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from '../../controllers/auth.controllers';
import { RequestHandler, Router } from 'express';
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
} from './validation';
import { verifyToken } from '../../middleware/verifytoken.middleware';

const router = Router();

router.get('/check-auth', verifyToken as RequestHandler, checkAuth as unknown as RequestHandler);
router.post('/signup', validate(registerValidation) as RequestHandler, register);
router.post('/login', validate(loginValidation) as RequestHandler, login);

router.get('/logout', logOut);

router.post('/verify-email', verifyEmail);
router.post(
  '/forgot-password',
  validate(forgotPasswordValidation) as RequestHandler,
  forgotPassword,
);
router.post(
  '/forgot-password/:token',
  validate(resetPasswordValidation) as RequestHandler,
  resetPassword,
);

export default router;

import { RequestHandler, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { verifyToken } from '../middleware/verifytoken.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from './validation';

const createAuthRouter = (authController: AuthController) => {
  const router = Router();

  router.post(
    '/signup',
    validate(registerValidation) as RequestHandler,
    authController.register.bind(authController),
  );
  router.post('/verify-email', authController.verifyEmail.bind(authController));
  router.post(
    '/login',
    validate(loginValidation) as RequestHandler,
    authController.login.bind(authController),
  );
  router.post(
    '/forgot-password',
    validate(forgotPasswordValidation) as RequestHandler,
    authController.forgotPassword.bind(authController),
  );
  router.post(
    '/reset-password/:token',
    validate(resetPasswordValidation) as RequestHandler,
    authController.resetPassword.bind(authController),
  );
  router.get(
    '/check-auth',
    verifyToken as RequestHandler,
    authController.checkAuth.bind(authController) as unknown as RequestHandler,
  );
  router.get('/logout', authController.logout.bind(authController));

  return router;
};

export default createAuthRouter;

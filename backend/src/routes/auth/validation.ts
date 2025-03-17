import { register } from '../../config/messages';
import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(register.wrong.emailRequired)
    .isEmail()
    .withMessage(register.wrong.emailInvalid),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(register.wrong.passwordRequired)
    .isLength({ min: 6 })
    .withMessage(register.wrong.passwordLength),
  body('name')
    .trim()
    .notEmpty()
    .withMessage(register.wrong.nameRequired),
]
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(register.wrong.emailRequired)
    .isEmail()
    .withMessage(register.wrong.emailInvalid),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(register.wrong.passwordRequired)
    .isLength({ min: 6 })
    .withMessage(register.wrong.passwordLength)
]
export const forgotPasswordValidation = [
  body('email')
  .trim()
  .notEmpty()
  .withMessage(register.wrong.emailRequired)
  .isEmail()
  .withMessage(register.wrong.emailInvalid),
]
export const resetPasswordValidation = [
  body('password')
  .trim()
  .notEmpty()
  .withMessage(register.wrong.passwordRequired)
  .isLength({ min: 6 })
  .withMessage(register.wrong.passwordLength),
]
import { messages } from '../../config/messages';
import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(messages.wrong.emailRequired)
    .isEmail()
    .withMessage(messages.wrong.emailInvalid),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(messages.wrong.passwordRequired)
    .isLength({ min: 6 })
    .withMessage(messages.wrong.passwordLength),
  body('name').trim().notEmpty().withMessage(messages.wrong.nameRequired),
];
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(messages.wrong.emailRequired)
    .isEmail()
    .withMessage(messages.wrong.emailInvalid),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(messages.wrong.passwordRequired)
    .isLength({ min: 6 })
    .withMessage(messages.wrong.passwordLength),
];
export const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(messages.wrong.emailRequired)
    .isEmail()
    .withMessage(messages.wrong.emailInvalid),
];
export const resetPasswordValidation = [
  body('password')
    .trim()
    .notEmpty()
    .withMessage(messages.wrong.passwordRequired)
    .isLength({ min: 6 })
    .withMessage(messages.wrong.passwordLength),
];

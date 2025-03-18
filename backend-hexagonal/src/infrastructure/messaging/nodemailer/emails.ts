import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from './emailTemplate';
import { EmailService } from './nodemailer.service';

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  try {
    const emailService = new EmailService();
    const isConnected = await emailService.verifyConnection();
    if (!isConnected) {
      throw new Error('No se pudo conectar al servidor SMTP');
    }
    const response = await emailService.sendEmail({
      to: email,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
    });
    console.log('Email sent successfully', response);
  } catch (error) {
    console.error('Error sending verification email', error);
    throw new Error(`Error sending verification email : ${error}`);
  }
};
export const sendWelcomeEmail = async (email: string) => {
  try {
    const emailService = new EmailService();
    const isConnected = await emailService.verifyConnection();

    if (!isConnected) {
      throw new Error('No se pudo conectar al servidor SMTP');
    }
    const response = await emailService.sendEmail({
      to: email,
      subject: 'Verify your email',
      html: WELCOME_EMAIL_TEMPLATE,
    });
    console.log('Email sent successfully', response);
  } catch (error) {
    console.error('Error sending Welcome email', error);
    throw new Error(`Error sending Welcome email : ${error}`);
  }
};
export const sendResetPasswordEmail = async (email: string, resetPasswordUrl: string) => {
  try {
    const emailService = new EmailService();
    const isConnected = await emailService.verifyConnection();

    if (!isConnected) {
      throw new Error('No se pudo conectar al servidor SMTP');
    }
    const response = await emailService.sendEmail({
      to: email,
      subject: 'Reset your password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetPasswordUrl),
    });
    console.log('Email sent reset request your password successfully', response);
  } catch (error) {
    console.error('Error sending reset request your password successfully', error);
    throw new Error(`Error sending reset request your password successfully : ${error}`);
  }
};
export const sendResetSuccessEmail = async (email: string) => {
  try {
    const emailService = new EmailService();
    const isConnected = await emailService.verifyConnection();

    if (!isConnected) {
      throw new Error('No se pudo conectar al servidor SMTP');
    }
    const response = await emailService.sendEmail({
      to: email,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log('Email sent reset password successfully', response);
  } catch (error) {
    console.error('Email sent reset password successfully', error);
    throw new Error(`Email sent reset password successfully : ${error}`);
  }
};

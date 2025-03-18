import { EmailService } from '../../domain/services/EmailService';

import {
  sendVerificationEmail as sendVerificationEmailUtil,
  sendWelcomeEmail as sendWelcomeEmailUtil,
  sendResetPasswordEmail as sendResetPasswordEmailUtil,
  sendResetSuccessEmail as sendResetSuccessEmailUtil,
} from '../../infrastructure/messaging/nodemailer/emails';

export class NodemailerEmailService implements EmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    await sendVerificationEmailUtil(email, token);
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    await sendWelcomeEmailUtil(email);
  }

  async sendResetPasswordEmail(email: string, resetUrl: string): Promise<void> {
    await sendResetPasswordEmailUtil(email, resetUrl);
  }

  async sendResetSuccessEmail(email: string): Promise<void> {
    await sendResetSuccessEmailUtil(email);
  }
}

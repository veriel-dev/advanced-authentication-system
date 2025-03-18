export interface EmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendWelcomeEmail(email: string): Promise<void>;
  sendResetPasswordEmail(email: string, resetUrl: string): Promise<void>;
  sendResetSuccessEmail(email: string): Promise<void>;
}

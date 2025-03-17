import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

import dotenv from 'dotenv';
import { config } from '../config/config';

dotenv.config();


export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: parseInt( config.emailPort || '587'),
      secure: config.emailPort === '465',
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });
  }
  async sendEmail(options: MailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: config.emailFrom || options.from,
        ...options
      });
      console.log('Mensaje enviado: %s', info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Servidor listo para enviar mensajes');
      return true;
    } catch (error) {
      console.error('Error al verificar la conexión:', error);
      return false;
    }
  }
}

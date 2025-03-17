import dotenv from 'dotenv';

dotenv.config();

export const  config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare',
  emailHost: process.env.EMAIL_HOST!!,
  emailPort: process.env.EMAIL_PORT!!,
  emailUser: process.env.EMAIL_USER!!,
  emailPassword: process.env.EMAIL_PASSWORD!!,
  emailFrom: process.env.EMAIL_FROM!!,
  clientUrl: process.env.CLIENT_URL!!,
  jwtSecret: process.env.JWT_SECRET!!,
}
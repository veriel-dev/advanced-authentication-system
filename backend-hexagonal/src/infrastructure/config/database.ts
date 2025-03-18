import mongoose from 'mongoose';
import { config } from './config';

/**
 * Connect MongoDbb
 */

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host} - Mongo Uri: ${config.mongoUri}`);
  } catch (error) {
    console.log('MongoDB connection errro:', error);
    process.exit(1);
  }
};

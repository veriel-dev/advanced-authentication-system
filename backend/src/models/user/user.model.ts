import mongoose, { Schema } from 'mongoose';
import { IUser } from './IUser';


const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type:String,
    required: true
  },
  name: {
    type:String,
    required: true
  },
  lastLogin: {
    type: Date, 
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date, 
}, {timestamps: true})

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
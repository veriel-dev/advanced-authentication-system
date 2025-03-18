import mongoose from 'mongoose';
import User, { IUser } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class MongoUserRepository implements UserRepository {
  async save(user: IUser): Promise<IUser> {
    if (user._id) {
      const userUpdated = await User.findByIdAndUpdate(user._id, user, { new: true });
      return userUpdated as unknown as IUser;
    } else {
      const newUser = new User(user);
      await newUser.save();
      return newUser as unknown as IUser;
    }
  }
  async findByEmail(email: string): Promise<IUser | null> {
    console.log(email);
    return await User.findOne({ email });
  }
  async findById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findById({ _id: id }).select('-password');
  }
  async findByVerificationToken(token: string, validTime: number): Promise<IUser | null> {
    return User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: validTime },
    });
  }
  async findByResetPasswordToken(token: string, validTime: number): Promise<IUser | null> {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: validTime },
    });
  }
}

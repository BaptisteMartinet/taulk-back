import mongoose from 'mongoose';
import type { IUser } from './User.model';

export interface IMessage {
  content: string,
  owner: IUser,
}

const MessageSchema = new mongoose.Schema<IMessage>({
  content: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema, 'messages');

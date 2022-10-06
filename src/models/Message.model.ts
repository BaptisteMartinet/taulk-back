import mongoose from 'mongoose';
import type { IUser } from './User.model';
import type { IChannel } from './Channel.model';

export interface IMessage {
  channel: IChannel;
  content: string;
  owner: IUser;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  channel: { type: mongoose.Types.ObjectId, ref: 'Channel', required: true },
  content: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema, 'messages');

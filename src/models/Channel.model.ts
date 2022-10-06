import mongoose from 'mongoose';
import { ILobby } from './Lobby.model';
import type { IMessage } from './Message.model';
import type { IUser } from './User.model';

export interface IChannel {
  lobby: ILobby;
  title: String;
  owner: IUser;
  users: Array<IUser>;
  messages: Array<IMessage>;
}

const ChannelSchema = new mongoose.Schema<IChannel>({
  lobby: { type: mongoose.Types.ObjectId, ref: 'Lobby', require: true },
  title: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: mongoose.Types.ObjectId, ref: 'Message', required: true }],
}, { timestamps: true });

export default mongoose.model('Channel', ChannelSchema, 'channels');

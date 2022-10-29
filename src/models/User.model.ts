import mongoose from 'mongoose';
import type { IChannel } from './Channel.model';
import type { ILobby } from './Lobby.model';

export interface IUser {
  username: string;
  email: string;
  password: string;
  lobbies: Array<ILobby>;
  channels: Array<IChannel>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  lobbies: [{ type: mongoose.Types.ObjectId, ref: 'Lobby', required: true }],
  channels: [{ type: mongoose.Types.ObjectId, ref: 'Channel', required: true }],
}, { timestamps: true });

export default mongoose.model('User', UserSchema, 'users');

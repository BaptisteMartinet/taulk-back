import mongoose from 'mongoose';
import type { IUser } from './User.model';
import type { IChannel } from './Channel.model';

export interface ILobby {
  title: string;
  description: string;
  owner: IUser;
  users: Array<IUser>;
  channels: Array<IChannel>;
}

const LobbySchema = new mongoose.Schema<ILobby>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
  channels: [{ type: mongoose.Types.ObjectId, ref: 'Channel', required: true }],
}, { timestamps: true });

export default mongoose.model('Lobby', LobbySchema, 'lobbies');

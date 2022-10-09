import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { HydratedDocument } from 'mongoose';
import { IContext } from 'utils/context';
import type { IChannel } from 'models/Channel.model';
import { ChannelModel, LobbyModel } from 'models';
import { ChannelType } from 'schema/output-types';

const ChannelMutation = new GraphQLObjectType({
  name: 'ChannelMutation',
  fields: {
    create: {
      type: ChannelType,
      args: {
        lobbyId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx: IContext) {
        const { lobbyId, title } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
        const lobby = await LobbyModel.findById(lobbyId);
        if (!lobby) {
          throw new Error(`Lobby#${lobbyId} does not exists`);
        }
        const channel = await ChannelModel.create({
          lobby: lobbyId,
          title,
          owner: currentUser.id,
        });
        lobby.channels.push(channel.id);
        await lobby.save();
        return channel.populate('owner');
      },
    },
    // update: {},
    delete: {
      type: GraphQLBoolean,
      async resolve(parent: HydratedDocument<IChannel>) {
        await ChannelModel.findByIdAndDelete(parent.id);
        return true;
      },
    },
  },
});

export default ChannelMutation;

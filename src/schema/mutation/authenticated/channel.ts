import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { IContextAuthenticated } from 'utils/context';
import { ChannelModel, LobbyModel } from 'models';
import { ChannelType } from 'schema/output-types';

const ChannelMutation = new GraphQLObjectType({
  name: 'ChannelMutation_Authenticated',
  fields: {
    create: {
      type: ChannelType,
      args: {
        lobbyId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        isPrivate: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(_, args, ctx: IContextAuthenticated) {
        const { lobbyId, title, isPrivate } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
        const lobby = await LobbyModel.findById(lobbyId);
        if (!lobby) {
          throw new Error(`Lobby#${lobbyId} does not exists`);
        }
        if (!lobby.users.includes(currentUser.id)) {
          throw new Error(`User#${currentUser.id} is not in Lobby#${lobbyId}`);
        }
        const channel = await ChannelModel.create({
          lobby: lobby.id,
          title,
          isPrivate,
          owner: currentUser.id,
          users: [currentUser.id],
        });
        await lobby.updateOne({ $push: { channels: channel.id } });
        return channel.populate('owner lobby users');
      },
    },
    // update: {},
    delete: {
      type: GraphQLBoolean,
      async resolve(parent) {
        await ChannelModel.findByIdAndDelete(parent.id);
        return true;
      },
    },

    join: {
      type: GraphQLBoolean,
      async resolve(channel, args, ctx: IContextAuthenticated) {
        const { currentUser } = ctx;
        await channel.updateOne({ $push: { users: currentUser.id } });
        return true;
      },
    },
    // leave: {},
  },
});

export default ChannelMutation;

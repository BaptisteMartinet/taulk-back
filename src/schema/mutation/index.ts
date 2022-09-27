import { GraphQLID, GraphQLObjectType } from 'graphql';
import LobbyModel from 'models/Lobby.model';
import ChannelModel from 'models/Channel.model';
import AccountMutation from './account';
import LobbyMutation from './lobby';
import ChannelMutation from './channel';

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    account: {
      type: AccountMutation,
      resolve() {
        return {};
      },
    },
    lobby: {
      type: LobbyMutation,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, ctx) {
        if (!id) return {};
        const lobby = await LobbyModel.findById(id);
        if (!lobby) throw new Error(`Lobby #${id} does not exist`);
        return lobby;
      },
    },
    channel: {
      type: ChannelMutation,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, ctx) {
        if (!id) return {};
        const channel = await ChannelModel.findById(id);
        if (!channel) throw new Error(`Channel #${id} does not exist`);
        return channel;
      },
    },
  },
});

export default mutationType;

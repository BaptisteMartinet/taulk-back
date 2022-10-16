import { GraphQLID, GraphQLObjectType } from 'graphql';
import {
  LobbyModel,
  ChannelModel,
  MessageModel,
} from 'models';
import LobbyMutation from './lobby';
import ChannelMutation from './channel';
import MessageMutation from './message';

const AuthenticatedMutation = new GraphQLObjectType({
  name: 'Mutation_Authenticated',
  fields: {
    lobby: {
      type: LobbyMutation,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, ctx) {
        if (!id) return {};
        const lobby = await LobbyModel.findById(id);
        if (!lobby) throw new Error(`Lobby#${id} does not exist`);
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
        if (!channel) throw new Error(`Channel#${id} does not exist`);
        return channel;
      },
    },
    message: {
      type: MessageMutation,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(_, { id }, ctx) {
        if (!id) return {};
        const message = await MessageModel.findById(id);
        if (!message) throw new Error(`Message#${id} does not exist`);
        return message;
      },
    },
  },
});

export default AuthenticatedMutation;

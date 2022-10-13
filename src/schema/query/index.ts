import { GraphQLList, GraphQLObjectType } from 'graphql';
import type { IContext } from 'utils/context';
import LobbyModel from 'models/Lobby.model';
import { LobbyType, LobbyFullType } from 'schema/output-types';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    lobbies: {
      type: new GraphQLList(LobbyType),
      async resolve() {
        const lobbies = await LobbyModel.find();
        return lobbies;
      },
    },
    myLobbies: {
      type: new GraphQLList(LobbyFullType),
      async resolve(_, args, ctx: IContext) {
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
        const lobbies = await LobbyModel.find({ users: currentUser.id }).populate([
          'owner',
          'users',
          {
            path: 'channels',
            model: 'Channel',
            populate: 'owner users messages',
          },
        ]);
        return lobbies;
      },
    },
  },
});

export default QueryType;

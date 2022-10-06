import { GraphQLList, GraphQLObjectType } from 'graphql';
import LobbyModel from 'models/Lobby.model';
import { LobbyType } from 'schema/output-types';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    lobbies: {
      type: new GraphQLList(LobbyType),
      async resolve(_, args, ctx) {
        const lobbies = await LobbyModel.find().populate('owner users channels');
        return lobbies;
      },
    },
  },
});

export default QueryType;

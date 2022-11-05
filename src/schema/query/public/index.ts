import { GraphQLObjectType, GraphQLList } from 'graphql';
import { LobbyModel } from 'models';
import { LobbyRestrictedType } from 'schema/output-types';

const PublicQuery = new GraphQLObjectType({
  name: 'Query_Public',
  fields: {
    lobbies: {
      type: new GraphQLList(LobbyRestrictedType),
      async resolve() {
        return LobbyModel.find({ isPrivate: false });
      },
    },
  },
});

export default PublicQuery;

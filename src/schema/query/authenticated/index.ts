import { GraphQLList, GraphQLObjectType } from 'graphql';
import { IContextAuthenticated } from 'utils/context';
import { LobbyType, UserType } from 'schema/output-types';
import { LobbyModel } from 'models';

const AuthenticatedQuery = new GraphQLObjectType({
  name: 'Query_Authenticated',
  fields: {
    account: {
      type: UserType,
      resolve(_, args, ctx: IContextAuthenticated) {
        return ctx.currentUser;
      },
    },
    myLobbies: {
      type: new GraphQLList(LobbyType),
      async resolve(_, args, ctx: IContextAuthenticated) {
        const { currentUser } = ctx;
        return LobbyModel.find({ users: currentUser.id }).populate([
          'owner',
          'users',
          {
            path: 'channels',
            model: 'Channel',
            populate: 'owner users messages',
          },
        ]);
      },
    },
  },
});

export default AuthenticatedQuery;

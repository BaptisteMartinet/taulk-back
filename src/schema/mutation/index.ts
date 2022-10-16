import { GraphQLObjectType } from 'graphql';
import { IContext, IContextAuthenticated } from 'utils/context';
import PublicMutation from './public';
import AuthenticatedMutation from './authenticated';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    public: {
      type: PublicMutation,
      resolve: () => ({}),
    },
    authenticated: {
      type: AuthenticatedMutation,
      resolve(_, args, ctx: IContext) {
        if (!ctx.currentUser) {
          throw new Error('User must be authenticated');
        }
        return {};
      },
    },
  },
});

export default MutationType;

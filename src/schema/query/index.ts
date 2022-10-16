import { GraphQLObjectType } from 'graphql';
import { IContext } from 'utils/context';
import PublicQuery from './public';
import AuthenticatedQuery from './authenticated';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    public: {
      type: PublicQuery,
      resolve: () => ({}),
    },
    authenticated: {
      type: AuthenticatedQuery,
      resolve(_, args, ctx: IContext) {
        if (!ctx.currentUser) {
          throw new Error('User must be authenticated');
        }
        return {};
      },
    },
  },
});

export default QueryType;

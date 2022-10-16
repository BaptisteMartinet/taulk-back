import { GraphQLObjectType } from 'graphql';
import AccountMutation from './account';

const PublicMutation = new GraphQLObjectType({
  name: 'Mutation_Public',
  fields: {
    account: {
      type: AccountMutation,
      resolve: () => ({}),
    },
  },
});

export default PublicMutation;

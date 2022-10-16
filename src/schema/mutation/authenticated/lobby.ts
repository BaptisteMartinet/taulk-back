import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { IContextAuthenticated } from 'utils/context';
import { LobbyType } from 'schema/output-types';
import { LobbyModel } from 'models';

const LobbyMutation = new GraphQLObjectType({
  name: 'LobbyMutation_Authenticated',
  fields: {
    create: {
      type: LobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx: IContextAuthenticated) {
        const { title, description } = args;
        const { currentUser } = ctx;
        const lobby = await LobbyModel.create({
          title,
          description,
          owner: currentUser.id,
          users: [currentUser.id],
        });
        return lobby.populate('owner users');
      },
    },
    // update: {},
    delete: {
      type: GraphQLBoolean,
      async resolve(parent) {
        await LobbyModel.findByIdAndDelete(parent.id);
        return true;
      },
    },
  },
});

export default LobbyMutation;
import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { IContext } from 'utils/context';
import { LobbyType } from 'schema/output-types';
import { LobbyModel } from 'models';

const LobbyMutation = new GraphQLObjectType({
  name: 'LobbyMutation',
  fields: {
    create: {
      type: LobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx: IContext) {
        const { title, description } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
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

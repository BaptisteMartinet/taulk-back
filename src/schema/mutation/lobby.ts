import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import type { HydratedDocument } from 'mongoose';
import { IContext } from 'utils/context';
import { LobbyType } from 'schema/output-types';
import LobbyModel, { ILobby } from 'models/Lobby.model';

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
        const lobby = await LobbyModel.create({ title, description, owner: currentUser.id });
        return lobby.populate('owner');
      },
    },
    // update: {},
    delete: {
      type: GraphQLBoolean,
      async resolve(parent: HydratedDocument<ILobby>) {
        await LobbyModel.findByIdAndDelete(parent.id);
        return true;
      },
    },
  },
});

export default LobbyMutation;

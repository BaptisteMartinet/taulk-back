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
        isPrivate: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(_, args, ctx: IContextAuthenticated) {
        const { title, description, isPrivate } = args;
        const { currentUser } = ctx;
        const lobby = await LobbyModel.create({
          title,
          description,
          isPrivate,
          owner: currentUser.id,
          users: [currentUser.id],
        });
        await currentUser.updateOne({ $push: { lobbies: lobby.id } });
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

    join: {
      type: GraphQLBoolean,
      async resolve(lobby, args, ctx: IContextAuthenticated) {
        const { currentUser } = ctx;
        await Promise.all([
          lobby.updateOne({ $push: { users: currentUser.id } }),
          currentUser.updateOne({ $push: { lobbies: lobby.id } }),
        ]);
        return true;
      },
    },
    // leave: {},
  },
});

export default LobbyMutation;

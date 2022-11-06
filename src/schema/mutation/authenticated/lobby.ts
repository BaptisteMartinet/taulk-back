import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'utils/env';
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
        return lobby.populate('owner users');
      },
    },
    // update: {},
    delete: {
      type: GraphQLBoolean,
      async resolve(lobby, args, ctx: IContextAuthenticated) {
        const { currentUser } = ctx;
        if (lobby.owner !== currentUser.id) {
          throw new Error('Must be owner');
        }
        await LobbyModel.findByIdAndDelete(lobby.id);
        return true;
      },
    },

    generateInvitationToken: {
      type: GraphQLString,
      resolve(lobby, args, ctx: IContextAuthenticated) {
        const { currentUser } = ctx;
        if (lobby == null) {
          return null;
        }
        if (lobby.isPrivate && !lobby.users.includes(currentUser.id)) {
          return null;
        }
        return jwt.sign({ lobbyId: lobby.id }, JWT_SECRET_KEY!, { expiresIn: '24h' });
      },
    },
    join: {
      type: GraphQLBoolean,
      args: {
        token: { type: GraphQLString },
      },
      async resolve(lobby, args, ctx: IContextAuthenticated) {
        const { currentUser } = ctx;
        const { token } = args;
        if (lobby != null && lobby.isPrivate === false) {
          if (lobby.users.includes(currentUser.id)) {
            throw new Error('Lobby already joined');
          }
          await lobby.updateOne({ $push: { users: currentUser.id } });
          return true;
        }
        if (token == null) return false;
        const payload: any = jwt.verify(token, JWT_SECRET_KEY!) as string;
        await LobbyModel.updateOne({ id: payload.lobbyId }, { $push: { users: currentUser.id } });
        return true;
      },
    },
  },
});

export default LobbyMutation;

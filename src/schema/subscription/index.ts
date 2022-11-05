import { GraphQLObjectType } from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from 'utils/env';
import type { IUser } from 'models/User.model';
import { UserModel } from 'models';
import { MessageType } from 'schema/output-types';

export const pubsub = new PubSub();

interface WSContext {
  currentUser: HydratedDocument<IUser>;
}

export const context = async (ctx: any): Promise<WSContext> => {
  const jwtToken = ctx.connectionParams?.Authorization as string | undefined;
  const token = jwtToken?.slice(7); // Slice out the 'Bearer ' part
  if (!token) throw new Error('User must provide auth token');
  const jwtPayload: any = jwt.verify(token, JWT_SECRET_KEY!);
  const currentUser = await UserModel.findById(jwtPayload.userId);
  if (!currentUser) throw new Error('User does not exist');
  return { currentUser };
};

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newMessage: {
      type: MessageType,
      subscribe: withFilter(
        () => pubsub.asyncIterator('NEW_MESSAGE'),
        (payload, args, ctx: WSContext) => {
          const channel = payload.newMessage.get('channel');
          if (channel.isPrivate) {
            return channel.users.includes(ctx.currentUser.id);
          }
          return channel.lobby.users.includes(ctx.currentUser.id);
        },
      ),
    },
  },
});

export default SubscriptionType;

import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { MessageModel } from 'models';
import { MessageType } from 'schema/output-types';
import { pubsub } from 'schema/subscription';

const MessageMutation = new GraphQLObjectType({
  name: 'MessageMutation',
  fields: {
    create: {
      type: MessageType,
      args: {
        channelId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx) {
        const { channelId, content } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
        const message = await MessageModel.create({
          channel: channelId,
          owner: currentUser.id,
          content,
        });
        pubsub.publish('NEW_MESSAGE', { newMessage: 'un message' });
        return message.populate('owner');
      },
    },
    // update: {},
    // delete: {},
  },
});

export default MessageMutation;

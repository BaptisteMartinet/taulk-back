import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { IContext } from 'utils/context';
import { MessageModel, ChannelModel } from 'models';
import { MessageType } from 'schema/output-types';
import { pubsub } from 'schema/subscription';

const MessageMutation = new GraphQLObjectType({
  name: 'MessageMutation',
  fields: {
    create: {
      type: MessageType,
      args: {
        channelId: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx: IContext) {
        const { channelId, text } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
        const channel = await ChannelModel.findById(channelId);
        if (!channel) {
          throw new Error(`Channel#${channelId} does not exist`);
        }
        if (!channel.users.includes(currentUser.id)) {
          throw new Error(`User#${currentUser.id} is not in Channel#${channelId}`);
        }
        const message = await MessageModel.create({
          channel: channelId,
          owner: currentUser.id,
          text,
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

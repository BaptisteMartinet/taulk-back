import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import type { IContextAuthenticated } from 'utils/context';
import { MessageModel, ChannelModel } from 'models';
import { MessageType } from 'schema/output-types';
import { pubsub } from 'schema/subscription';

const MessageMutation = new GraphQLObjectType({
  name: 'MessageMutation_Authenticated',
  fields: {
    create: {
      type: MessageType,
      args: {
        channelId: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx: IContextAuthenticated) {
        const { channelId, text } = args;
        const { currentUser } = ctx;
        const channel = await ChannelModel.findById(channelId);
        if (!channel) {
          throw new Error(`Channel#${channelId} does not exist`);
        }
        if (!channel.users.includes(currentUser.id)) {
          throw new Error(`User#${currentUser.id} is not in Channel#${channelId}`);
        }
        const message = await MessageModel.create({
          channel: channel.id,
          owner: currentUser.id,
          text,
        });
        await channel.updateOne({ $push: { messages: message.id } });
        const populatedMessage = await message.populate([
          'owner',
          {
            path: 'channel',
            model: 'Channel',
            populate: 'lobby',
          },
        ]);
        // populatedMessage.set('lobby', channel.lobby, { strict: false });
        pubsub.publish('NEW_MESSAGE', { newMessage: populatedMessage });
        return populatedMessage;
      },
    },
    // update: {},
    // delete: {},
  },
});

export default MessageMutation;

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { MessageType } from 'schema/output-types';

export const pubsub = new PubSub();

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newMessage: {
      type: MessageType,
      args: {
        channelsIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) },
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator('NEW_MESSAGE'),
        (payload, args) => args.channelsIds.includes(payload.newMessage.channel.toString()),
      ),
    },
  },
});

export default SubscriptionType;

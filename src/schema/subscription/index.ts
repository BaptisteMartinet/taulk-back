import { GraphQLObjectType } from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { MessageType } from 'schema/output-types';

export const pubsub = new PubSub();

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newMessage: {
      type: MessageType,
      subscribe: withFilter(
        () => pubsub.asyncIterator('NEW_MESSAGE'),
        (payload, args) => true,
      ),
    },
  },
});

export default SubscriptionType;

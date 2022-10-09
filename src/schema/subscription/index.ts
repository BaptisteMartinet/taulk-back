import { GraphQLObjectType, GraphQLString } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

const SubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newMessage: {
      type: GraphQLString,
      subscribe: () => (pubsub.asyncIterator('NEW_MESSAGE')),
    },
  },
});

export default SubscriptionType;

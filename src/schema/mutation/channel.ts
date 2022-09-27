import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { HydratedDocument } from 'mongoose';
import { ChannelType } from 'schema/output-types';
import ChannelModel, { IChannel } from 'models/Channel.model';

const ChannelMutation = new GraphQLObjectType({
  name: 'ChannelMutation',
  fields: {
    create: {
      type: ChannelType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx) {
        const { title } = args;
        const { currentUser } = ctx;
        if (!currentUser) {
          throw new Error('User must be authenticated');
        }
        const channel = await ChannelModel.create({ title, owner: currentUser.id });
        return channel.populate('owner');
      },
    },
    // TODO update field
    delete: {
      type: GraphQLBoolean,
      async resolve(parent: HydratedDocument<IChannel>) {
        await ChannelModel.findByIdAndDelete(parent.id);
        return true;
      },
    },
  },
});

export default ChannelMutation;

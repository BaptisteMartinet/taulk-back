/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import GraphQLDate from 'schema/scalars/date';

export const UserRestrictedType = new GraphQLObjectType({
  name: 'UserRestricted',
  fields: () => ({
    username: { type: GraphQLString },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  }),
});

export const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    channel: { type: ChannelType },
    owner: { type: UserRestrictedType },
    text: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  }),
});

export const ChannelType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Channel',
  fields: () => ({
    id: { type: GraphQLID },
    lobby: { type: LobbyType },
    title: { type: GraphQLString },
    owner: { type: UserType },
    users: { type: new GraphQLList(UserRestrictedType) },
    messages: { type: new GraphQLList(MessageType) },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  }),
});

export const LobbyRestrictedType = new GraphQLObjectType({
  name: 'LobbyRestricted',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  }),
});

export const LobbyType = new GraphQLObjectType({
  name: 'Lobby',
  fields: () => ({
    id: { type: GraphQLID },
    owner: { type: UserRestrictedType },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    channels: { type: new GraphQLList(ChannelType) },
    users: { type: new GraphQLList(UserRestrictedType) },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  }),
});

import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import GraphQLDate from 'schema/scalars/date';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    username: { type: GraphQLString },
  },
});

export const UserFullType = new GraphQLObjectType({
  name: 'UserFull',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  },
});

export const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: { type: GraphQLID },
    owner: { type: UserType },
    text: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  },
});

export const ChannelType = new GraphQLObjectType({
  name: 'Channel',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    owner: { type: UserType },
    users: { type: new GraphQLList(UserType) },
    messages: { type: new GraphQLList(MessageType) },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  },
});

export const LobbyType = new GraphQLObjectType({
  name: 'Lobby',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  },
});

export const LobbyFullType = new GraphQLObjectType({
  name: 'LobbyFull',
  fields: {
    id: { type: GraphQLID },
    owner: { type: UserType },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    channels: { type: new GraphQLList(ChannelType) },
    users: { type: new GraphQLList(UserType) },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  },
});

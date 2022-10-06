import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
  },
});

export const UserTypeFull = new GraphQLObjectType({
  name: 'UserFull',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
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
  },
});

export const LobbyType = new GraphQLObjectType({
  name: 'Lobby',
  fields: {
    id: { type: GraphQLID },
    owner: { type: UserType },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    channels: { type: new GraphQLList(ChannelType) },
    users: { type: new GraphQLList(UserType) },
  },
});

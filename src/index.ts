import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { UserModel } from 'models';
import {
  DATABASE_URL,
  PORT,
  JWT_SECRET_KEY,
  NODE_ENV,
} from './utils/env';
import schema from './schema';

(async () => {
  if (!DATABASE_URL || !JWT_SECRET_KEY) {
    throw new Error('Missing environment variables');
  }
  mongoose.set('debug', NODE_ENV === 'dev');
  await mongoose.connect(DATABASE_URL);
  console.info('Successfully connected to mongoDB');
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req }) => {
      const token = req.headers.authorization;
      if (!token) return {};
      const jwtPayload = jwt.verify(token, JWT_SECRET_KEY!) as any;
      if (!jwtPayload) throw new Error('Unable to verify Authorization header');
      const currentUser = await UserModel.findById(jwtPayload.userId);
      if (!currentUser) throw new Error('User does not exist');
      return { currentUser };
    },
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  server.listen({ port: PORT ?? 4000 }).then(({ url }) => {
    console.info(`🚀  Server ready at ${url}`);
  });
})();

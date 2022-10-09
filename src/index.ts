import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
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
  const app = express();
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const wsServerCleanup = useServer({ schema }, wsServer);
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: async ({ req }) => {
      const token = req.headers.authorization?.slice(7); // Slice out the 'Bearer ' part
      if (!token) return {};
      const jwtPayload = jwt.verify(token, JWT_SECRET_KEY!) as any;
      if (!jwtPayload) throw new Error('Unable to verify Authorization header');
      const currentUser = await UserModel.findById(jwtPayload.userId);
      if (!currentUser) throw new Error('User does not exist');
      return { currentUser };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => ({
          drainServer: async () => { await wsServerCleanup.dispose(); },
        }),
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT ?? 4000, () => { resolve(); });
  });
  console.info('🚀 Server ready 🚀');
})();

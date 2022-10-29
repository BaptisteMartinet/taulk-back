import mongoose from 'mongoose';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import {
  DATABASE_URL,
  PORT,
  JWT_SECRET_KEY,
  NODE_ENV,
} from 'utils/env';
import context from 'utils/context';
import schema from 'schema';
import { context as wsContext } from 'schema/subscription';

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
  const wsServerCleanup = useServer({
    schema,
    context: wsContext,
  }, wsServer);
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context,
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

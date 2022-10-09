import jwt from 'jsonwebtoken';
import express from 'express';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { UserModel } from 'models';
import { JWT_SECRET_KEY } from 'utils/env';

export interface IContext {
  req: express.Request;
  res: express.Response;
  currentUser?: any;
}

const context: ContextFunction<ExpressContext> = async ({ req, res }): Promise<IContext> => {
  const ctx: IContext = { req, res };
  const token = req.headers.authorization?.slice(7); // Slice out the 'Bearer ' part
  if (!token) return ctx;
  let jwtPayload: any = null;
  try {
    jwtPayload = jwt.verify(token, JWT_SECRET_KEY!);
  } catch (e: any) { /* empty */ }
  if (!jwtPayload) return ctx;
  const currentUser = await UserModel.findById(jwtPayload.userId);
  if (!currentUser) throw new Error('User does not exist');
  Object.assign(ctx, { currentUser });
  return ctx;
};

export default context;

import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import type { IUser } from 'models/User.model';
import { UserModel } from 'models';
import { UserTypeFull } from 'schema/output-types';

const AccountMutation = new GraphQLObjectType({
  name: 'AccountMutation',
  fields: {
    register: {
      type: GraphQLBoolean,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx) {
        const { username, email, password } = args;
        if (await UserModel.exists({ email })) {
          throw new Error('Email already exists');
        }
        if (!(await UserModel.create({
          username,
          email,
          password: bcrypt.hashSync(password, 10),
        }))) {
          throw new Error('Cannot create user');
        }
        return true;
      },
    },
    login: {
      type: UserTypeFull,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx) {
        const { email, password } = args;
        const user: HydratedDocument<IUser> | null = await UserModel.findOne({ email }, '+password');
        if (!user) {
          throw new Error('User does not exist');
        }
        if (!bcrypt.compareSync(password, user.password)) {
          throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, { expiresIn: '48h' });
        Object.assign(user, { token: `Bearer ${token}` });
        return user;
      },
    },
  },
});

export default AccountMutation;

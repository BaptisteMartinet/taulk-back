import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from 'models';
import { UserFullType } from 'schema/output-types';

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
        const user = await UserModel.create({
          username,
          email,
          password: bcrypt.hashSync(password, 10),
        });
        if (!user) {
          throw new Error('Cannot create user');
        }
        return true;
      },
    },
    login: {
      type: UserFullType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, args, ctx) {
        const { email, password } = args;
        const user = await UserModel.findOne({ email }, '+password');
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

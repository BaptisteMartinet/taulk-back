import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const {
  JWT_SECRET_KEY,
  PORT,
  DATABASE_URL,
  NODE_ENV,
} = process.env;

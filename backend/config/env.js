import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({
  path: path.resolve(
    __dirname,
    `../.env.${process.env.NODE_ENV || 'development'}.local`
  )
});

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_ENV, ARCJET_KEY, SERVER_URL, QSTASH_URL, QSTASH_TOKEN, EMAIL_PASSWORD } = process.env;

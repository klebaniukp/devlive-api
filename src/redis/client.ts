import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.REDIS_HOST as string;
const redisPort = process.env.REDIS_PORT as string;
const password = process.env.REDIS_PASSWORD as string;

export const client = createClient({
    url: 'redis://:' + password + '@' + host + ':' + redisPort,
});
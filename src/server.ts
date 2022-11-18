import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { client as redisClient } from './redis/client';

dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET as string;
const PORT = process.env.PORT || 8080;
const oneHour = 3600000;

const app = express();

app.set('trust proxy', 1);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: oneHour,
            httpOnly: true,
            secure: true,
            sameSite: false,
            path: '/',
        },
    }),
);

const origin =
    process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:3000';

app.use(
    cors({
        credentials: true,
        origin,
    }),
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server Running on: http://localhost:${PORT}`);
    (async () => {
        await redisClient.connect();

        redisClient.on('error', (err: string) =>
            console.log('Redis Client Error', err),
        );
    })();
});

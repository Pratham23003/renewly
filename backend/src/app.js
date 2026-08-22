import express from 'express';
import { NODE_ENV, PORT } from '../config/env.js';
import authRouter from "../routes/auth.routes.js"
import userRouter from "../routes/user.routes.js"
import subscriptionRouter from "../routes/subscription.routes.js"
import connectDB from '../database/mongodb.js';
import errorMiddleware from '../middlewares/error.middleware.js';
import cookieParser from "cookie-parser";
import arcjetMiddleware from '../middlewares/arcjet.middleware.js';
import workflowRouter from '../routes/workflow.routes.js';
import cors from 'cors';

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4200',
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some((o) => origin.startsWith(o))) {
            callback(null, true);
        } else {
            callback(null, true); // fallback for API clients / tools
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

connectDB()
.then(() => app.listen(PORT, () => {console.log(`Express listening on http://localhost:${PORT} .. Connected to DB in ${NODE_ENV} mode`)}))
.catch((err) => console.log(err.message));

export default app; 
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'dotenv/config';

import connectDatababse from './db/connectDatabase.js';

import loggerMiddleware from './middlewares/logger.middleware.js';
import notFoundMiddleware from './middlewares/not-found.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

import contactsRouter from './routes/contacts.router.js';
import authRouter from './routes/auth.router.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/auth", authRouter);
app.use('/contacts', contactsRouter);

app.use(notFoundMiddleware);
app.use(errors());
app.use(errorMiddleware);

const port = Number(process.env.PORT) || 3030;

await connectDatababse();

app.listen(port, () => console.log(`Server running ${port} port`));

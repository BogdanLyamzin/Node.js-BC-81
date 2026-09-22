import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import createHttpError, { HttpError } from 'http-errors';
import 'dotenv/config';

import connectDatababse from './db/connectDatabase.js';
import Contact from './db/models/Contact.js';

const app = express();

app.use(cors());

const logger = PinoHttp({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      hideObject: true,
      messageFormat:
        '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
    },
  },
});

app.use(logger);

app.get('/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.get('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  // const result = await Contact.findOne({_id: id});
  const result = await Contact.findById(id);
  if (!result) throw createHttpError(404, `Contact with id=${id} not found`);
  // if(!result) {
  //   return res.status(404).json({
  //     message: `Contact with id=${id} not found`
  //   });
  // }
  res.json(result);
});

app.use((req, res) => {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`,
  });
});

app.use((error, req, res, next) => {
  if (error instanceof HttpError) {
    const { status = 500 } = error;
    return res.status(status).json({
      message: error.message,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'Some error' : error.message;
  res.status(500).json({
    message,
  });
});

const port = Number(process.env.PORT) || 3030;

await connectDatababse();

app.listen(port, () => console.log(`Server running ${port} port`));

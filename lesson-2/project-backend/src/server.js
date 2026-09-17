import express from 'express';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import cors from 'cors';
import PinoHttp from 'pino-http';

const contactsPath = join(process.cwd(), 'src', 'contacts.json');

const getContacts = async () => {
  const data = await readFile(contactsPath, 'utf-8');
  const contacts = JSON.parse(data);
  return contacts;
};

const app = express(); // app - web-server

app.use(cors());
// const corsMiddleware = cors();
// app.use(corsMiddleware);
// const cors = options => {
//   const middleware = (req, res, next)=> {
//     // add options
//      res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
//     next();
//   }
//   return middleware;
// }

// app.use((req, res, next)=> {
//  res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
//   next();
// })

// app.use((req, res, next)=> {
//   console.log("First middleware");
//   next();
// })

// app.use((req, res, next)=> {
//   console.log("Second middleware");
//   next();
// })

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

app.get('/', (request, response) => {
  console.log(request.method);
  console.log(request.url);
  response.send('<h1>Home page</h1>');
});

app.get('/contacts', async (req, res) => {
  const contacts = await getContacts();
  res.json(contacts);
  // console.log("After send response");
});

// const contactController = async (req, res) => {
//   const contacts = await getContacts();
//   res.json(contacts);
//   // console.log("After send response");
// };

// app.get('/contacts', (req, res, next)=> {
//   try {
//     contactController(req, res, next);
//   }
//   catch(error) {
//     next(error);
//   }
// });

app.get('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const contacts = await getContacts();
  const result = contacts.find((item) => item.id === id);
  res.json(result);
});

app.use((req, res) => {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`,
  });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
  });
});

const port = Number(process.env.PORT) || 3030;

app.listen(port, () => console.log(`Server running ${port} port`));

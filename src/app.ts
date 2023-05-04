import express, { Express } from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import morgan from 'morgan';

// process.env
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

import apiRouter from './routers/api';
import wssHandler from './ws/ws';
import sequelize from './db/client';
import './db/relations';

import swaggerUi from 'swagger-ui-express';
import specs from './docs/specs';

import middlewareLogEntry from './middlewares/log_entry';
import middlewareLogExit from './middlewares/log_exit';

import { sendError } from './scripts/send';

// Creating express app
const app: Express = express();

if (process.env.LOG !== 'true') {
    console = console || {};
    console.log = function () {};
}

sequelize.sync()
    .then(() => console.log('-> Tables created!'))
    .catch(err => console.error('-> Error creating tables:', err));

// Enable websockets
expressWs(app);

// Logs
app.use(middlewareLogEntry);
app.use(middlewareLogExit);

// Static content
app.use(express.static('static'));

app.use(cors());
app.use(morgan('[info] [morgan]: :method :url :status :res[content-length]B - :response-time ms'));

// Router for documentation
app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Router for api
app.use('/api', apiRouter);

// Router for ws
app.ws('/ws', wssHandler);

// Default routes
app.get('/', (req, res) => res.redirect('/index.html'));
app.get('*', (req, res) => sendError(res, 404, 'Not found'));
app.put('*', (req, res) => sendError(res, 405, 'Not allowed'));
app.post('*', (req, res) => sendError(res, 405, 'Not allowed'));
app.delete('*', (req, res) => sendError(res, 404, 'Not found'));

// starting app
app.listen(process.env.PORT, () => console.log(`-> API communications running on port ${process.env.PORT}`));

export default app;
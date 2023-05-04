import express, {Request, Response} from 'express';
import cors from 'cors';
import morgan from 'morgan';

// process.env
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

import apiRouter from './routers/api';
import wssHandler from './ws/ws';
import sequelize from './db/client';

import swaggerUi from 'swagger-ui-express';
import specs from './docs/specs';

import middleware_log_entry from './middlewares/log_entry';
import middleware_log_exit from './middlewares/log_exit';
import {send_error} from "./scripts/send";


if (process.env.LOG !== 'true') {
    console = console || {};
    console.log = function () {};
}

sequelize.sync()
.then(() => console.log('-> Tables created!'))
.catch(err => console.error('-> Error creating tables:', err));

// Enable websockets
var expressWs = require('express-ws')(express());
const app = expressWs.app;

// Logs
app.use(middleware_log_exit);
app.use(middleware_log_entry);

// Static content
app.use(express.static('static'));

app.use(cors());
app.use(morgan('[info] [morgan]: :method :url :status :res[content-length]B - :response-time ms'));

// Router for documentation
app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true, customSiteTitle : "Loqui documentation", isExplorer : true }));

// Router for api
app.use('/api', apiRouter);

// Router for ws
app.ws('/ws', wssHandler);

// Default routes
app.get('/', (req : Request, res : Response) => res.sendFile('/index.html'));
app.get('*', (req : Request, res : Response) => send_error(res, 404, 'Not found'));
app.put('*', (req : Request, res : Response) => send_error(res, 405, 'Not allowed'));
app.post('*', (req : Request, res : Response) => send_error(res, 405, 'Not allowed'));
app.delete('*', (req : Request, res : Response) => send_error(res, 404, 'Not found'));

// starting app
app.listen(process.env.PORT, () => console.log(`-> API communications running on port ${process.env.PORT}`));

export default app;
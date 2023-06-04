import express, {Request, Response} from 'express';
import cors from 'cors';
import morgan from 'morgan';

// process.env
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

import apiRouter from './routers/api';
import sequelize from './db/client';

import middleware_log_entry from './middlewares/log_entry';
import middleware_log_exit from './middlewares/log_exit';
import {send_error} from "./scripts/send";


if (process.env.LOG !== 'true') {
    console = console || {};
    console.log = function () {};
}

sequelize.sync({ force : process.env.FORCE_RELOAD_DB === 'true' })
.then(() => console.log('-> Tables created!'))
.catch(err => console.error('-> Error creating tables:', err));

const app = express();

// Logs
app.use(middleware_log_exit);
app.use(middleware_log_entry);

app.use(cors());
app.use(morgan('[info] [morgan]: :method :url :status :res[content-length]B - :response-time ms'));

// Router for api
app.use('/api', apiRouter);

app.get('*', (req : Request, res : Response) => send_error(res, 404, 'Not found'));
app.put('*', (req : Request, res : Response) => send_error(res, 405, 'Not allowed'));
app.post('*', (req : Request, res : Response) => send_error(res, 405, 'Not allowed'));
app.delete('*', (req : Request, res : Response) => send_error(res, 404, 'Not found'));

// starting app
app.listen(process.env.PORT, () => console.log(`-> API communications running on port ${process.env.PORT}`));

export default app;
